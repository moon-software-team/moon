export interface MoonConfig {
  server: {
    port: number;
  };
  plex: {
    server: string;
    token: string;
    port: number;
  };
}

export const DEFAULT_CONFIG: MoonConfig = {
  server: {
    port: 45001
  },
  plex: {
    server: '127.0.0.1',
    token: '',
    port: 32400
  }
};
