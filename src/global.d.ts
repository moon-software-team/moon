import type { DEFAULT_CONFIG, MoonConfig } from './types';
import { Application } from './app';

declare global {
  namespace NodeJS {
    interface Process {
      moonConfig: MoonConfig;
      moon: Application;
    }
  }
}

process.moonConfig = DEFAULT_CONFIG;
