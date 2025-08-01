/** Dependencies */
import { setupDirectories, LOCALAPPDATA } from '@/utils/directories';
import { MoonConfig } from '@/types/config';
import path from 'path';
import fs from 'fs';

/** Application configuration */
export const MOON_CONFIG: MoonConfig = {
  server: {
    port: 45001,
    host: '0.0.0.0'
  },
  musicDirectory: '.',
  plex: {
    server: '127.0.0.1',
    token: '',
    port: 32400
  }
};

/** Application tree */
const MOON_APP_TREE = {
  moon: {
    'cache': {},
    'binaries': {},
    'config': {
      'config.json': JSON.stringify(MOON_CONFIG, null, 2)
    },
    'logs': {},
    'data': {
      'database.db': '',
      'media': {}
    },
    'temp': {},
    'plugins': {},
    'themes': {
      'default.theme': ''
    },
    'saves': {},
    'README.txt': '',
    'LICENSE.txt': ''
  }
};

/**
 * @brief Setup application directories.
 * @description This function initializes the application directories based on a predefined tree structure.
 * It creates necessary directories and files in the user's local application data directory.
 * If the directories already exist, it does not overwrite them.
 */
export const setup = (): void => {
  /** Ensure the moon namespace exists */
  if (!process.moon) {
    process.moon = {};
  }

  // Set the application folder path
  process.moon.appfolder = path.join(LOCALAPPDATA, 'moon');

  // Setup directories based on the predefined tree structure
  setupDirectories(MOON_APP_TREE, LOCALAPPDATA);

  // Get the config of the application
  const configPath = path.join(process.moon.appfolder, 'config', 'config.json');

  // If the config file exists, read it and merge with the default config
  if (fs.existsSync(configPath)) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      process.moon.config = { ...MOON_CONFIG, ...JSON.parse(configContent) };
    } catch (error) {
      console.error('Failed to read or parse the configuration file:', error);
      process.moon.config = MOON_CONFIG;
    }
  }
};
