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

type VLCBaseCommands =
  | 'playlist'
  | 'play'
  | 'stop'
  | 'next'
  | 'prev'
  | 'clear'
  | 'status'
  | 'title_n'
  | 'title_p'
  | 'chapter_n'
  | 'chapter_p'
  | 'pause'
  | 'fastforward'
  | 'rewind'
  | 'faster'
  | 'slower'
  | 'normal'
  | 'frame'
  | 'fullscreen'
  | 'f'
  | 'F'
  | 'stats'
  | 'get_time'
  | 'is_playing'
  | 'get_title'
  | 'get_length'
  | 'snapshot'
  | 'vlm'
  | 'description'
  | 'help'
  | 'longhelp'
  | 'lock'
  | 'logout'
  | 'quit'
  | 'shutdown';

// Commands with optional parameters
type VLCOptionalParamCommands =
  | `search${string}`
  | `repeat ${'on' | 'off'}`
  | `loop ${'on' | 'off'}`
  | `random ${'on' | 'off'}`
  | `fullscreen ${'on' | 'off'}`
  | `f ${'on' | 'off'}`
  | `F ${'on' | 'off'}`
  | `help${string}`
  | `longhelp${string}`;

// Commands with required parameters
type VLCRequiredParamCommands =
  | `add ${string}`
  | `enqueue ${string}`
  | `delete ${number}`
  | `move ${number} ${number}`
  | `sort ${string}`
  | `sd ${string}`
  | `goto ${number}`
  | `gotoitem ${number}`
  | `title ${number}`
  | `chapter ${number}`
  | `seek ${number}`
  | `rate ${number}`
  | `info ${number}`
  | `volume ${number}`
  | `volup ${number}`
  | `voldown ${number}`
  | `achan ${number}`
  | `atrack ${number}`
  | `vtrack ${number}`
  | `vratio ${string}`
  | `vcrop ${string}`
  | `crop ${string}`
  | `vzoom ${number}`
  | `zoom ${number}`
  | `vdeinterlace ${string}`
  | `vdeinterlace_mode ${string}`
  | `strack ${number}`;

// Union of all command types
export type VLCCommand = VLCBaseCommands | VLCOptionalParamCommands | VLCRequiredParamCommands;

// Helper type for commands that can be used without parameters (getters)
export type VLCGetterCommands =
  | 'volume'
  | 'title'
  | 'chapter'
  | 'achan'
  | 'atrack'
  | 'vtrack'
  | 'vratio'
  | 'vcrop'
  | 'crop'
  | 'vzoom'
  | 'zoom'
  | 'vdeinterlace'
  | 'vdeinterlace_mode'
  | 'strack'
  | 'info'
  | 'search'
  | 'repeat'
  | 'loop'
  | 'random'
  | 'fullscreen'
  | 'f'
  | 'F'
  | 'help'
  | 'longhelp';
