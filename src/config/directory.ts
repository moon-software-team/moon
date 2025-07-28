import fs from 'fs';
import path from 'path';

export const APPDATA =
  process.env.LOCALAPPDATA ||
  (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share');

export const MOON_DIRECTORY = path.join(APPDATA, 'moon');

export const setupDirectories = () => {
  const directories = [
    MOON_DIRECTORY,
    path.join(MOON_DIRECTORY, 'logs'),
    path.join(MOON_DIRECTORY, 'binaries'),
    path.join(MOON_DIRECTORY, 'caches')
  ];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
