export interface MoonConfig {
  server: {
    port: number;
  };
  plex: {
    server: string;
    token: string;
    port: number;
  };
  vlc: {
    port: number;
    password: string;
  }
}

export const DEFAULT_CONFIG: MoonConfig = {
  server: {
    port: 45001
  },
  plex: {
    server: '127.0.0.1',
    token: '',
    port: 32400
  },
  vlc: {
    port: 45002,
    password: 'moon-htpc'
  }
};
