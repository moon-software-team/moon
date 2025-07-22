export interface VLCConfig {
  httpPassword: string;
  httpPort: number;
  vlcPath?: string;
}

export interface VLCStatus {
  state: string;
  position: number;
  length: number;
  volume: number;
  currentplid: number;
}

export interface AudioTrack {
  id: number;
  name: string;
  codec: string;
  language?: string;
}

export interface SubtitleTrack {
  id: number;
  name: string;
  language?: string;
}
