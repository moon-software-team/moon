export interface MoonConfig {
  assets: {
    musicPath: string;
  },
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
  assets: {
    musicPath: ''
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
