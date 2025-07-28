import process from 'process';
import fs from 'fs';
import path from 'path';
import { MoonConfig, DEFAULT_CONFIG } from '../types';
import { MOON_DIRECTORY, setupDirectories } from './directory';

export const MOON_CONFIG_FILE = path.join(MOON_DIRECTORY, 'config.json');

export const loadConfig = () => {
  if (!fs.existsSync(MOON_CONFIG_FILE)) {
    fs.writeFileSync(MOON_CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG));
  }

  const config = { ...DEFAULT_CONFIG, ...JSON.parse(fs.readFileSync(MOON_CONFIG_FILE, 'utf-8')) };

  process.moonConfig = config;

  return config;
};

export const saveConfig = (config: MoonConfig) => {
  process.moonConfig = config;

  if (!fs.existsSync(MOON_DIRECTORY)) {
    setupDirectories();
  }

  fs.writeFileSync(MOON_CONFIG_FILE, JSON.stringify({ ...DEFAULT_CONFIG, ...config }, null, 2));
};
