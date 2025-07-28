import type { DEFAULT_CONFIG, MoonConfig } from './types';

declare global {
  namespace NodeJS {
    interface Process {
      moonConfig: MoonConfig;
    }
  }
}

process.moonConfig = DEFAULT_CONFIG;
