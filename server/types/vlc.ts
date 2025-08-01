/**
 * @brief VLC configuration interface
 * @description This interface defines the structure for VLC configuration settings.
 */
export interface VLCConfig {
  /**
   * @brief VLC media player http interface configuration
   * @description This object contains the settings for connecting to the VLC media player's HTTP interface.
   * @property {string} host - The hostname or IP address of the VLC server.
   * @property {number} port - The port number on which the VLC server's HTTP interface is running.
   * @property {string} password - The password for authenticating with the
   */
  http: {
    /**
     * @brief Hostname or IP address of the VLC server
     * @description This is the address where the VLC server can be accessed.
     * @type {string}
     * @default '127.0.0.1'
     */
    host: string;

    /**
     * @brief Port number for the VLC server's HTTP interface
     * @description This is the port on which the VLC server's HTTP interface listens for requests.
     * @type {number}
     * @default 45001
     */
    port: number;

    /**
     * @brief Password for authenticating with the VLC server
     * @description This is the password required to access the VLC server's HTTP interface.
     * @type {string}
     * @default 'moon'
     */
    password: string;
  };
}

/**
 * @brief VLC media player aspect ratio types
 * @description This type defines the possible aspect ratios that can be used in VLC media player.
 */
export type VLCAspectRatio = 'default' | '1:1' | '4:3' | '5:4' | '16:9' | '16:10' | '221:100' | '235:100' | '239:100';

/**
 * @brief VLC command interface
 * @description This interface defines the structure for commands that can be sent to the VLC media player.
 */
export type VLCCommand =
  | {}
  | {
      command: 'pl_play';
      id?: number;
    }
  | {
      command: 'pl_pause';
      id?: number;
    }
  | {
      command: 'pl_forceresume';
    }
  | {
      command: 'pl_forcepause';
    }
  | {
      command: 'pl_stop';
    }
  | {
      command: 'pl_next';
    }
  | {
      command: 'pl_previous';
    }
  | {
      command: 'pl_empty';
    }
  | {
      command: 'audiodelay';
      val: number;
    }
  | {
      command: 'subdelay';
      val: number;
    }
  | {
      command: 'rate';
      val: number;
    }
  | {
      command: 'aspectratio';
      val: VLCAspectRatio;
    }
  | {
      command: 'pl_sort';
      val: 0 | 1 | 3 | 5 | 7;
    }
  | {
      command: 'pl_random';
    }
  | {
      command: 'pl_loop';
    }
  | {
      command: 'pl_repeat';
    }
  | {
      command: 'fullscreen';
    }
  | {
      command: 'volume';
      val: `+${number}` | `-${number}` | `${number}%` | `${number}` | number;
    }
  | {
      command: 'seek';
      val:
        | number
        | `${number}`
        | `${'+' | '-' | ''}${number}${'H' | 'h' | 'M' | 'm' | 'S' | 's' | '"' | "'"}`
        | `${'+' | '-' | ''}${number}${'H' | 'h' | 'M' | 'm' | "'"}${number}${'m' | 'M' | 'S' | 's' | '"' | "'"}`
        | `${'+' | '-' | ''}${number}${'H' | 'h'}${number}${'m' | 'M' | "'"}${number}${'S' | 's' | '"'}`
        | `${'+' | '-' | ''}${number}%`;
    }
  | {
      command: 'preamp';
      val: number;
    }
  | {
      command: 'enableeq';
      val: 0 | 1;
    }
  | {
      command: 'equalizer';
      band: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
      val: number;
    }
  | {
      command: 'setpreset';
      val: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    }
  | {
      command: 'title';
      val: number | string;
    }
  | {
      command: 'chapter';
      val: number | string;
    }
  | {
      command: 'audio_track';
      val: number;
    }
  | {
      command: 'video_track';
      val: number;
    }
  | {
      command: 'subtitle_track';
      val: number;
    }
  | {
      command: 'in_play';
      input: string;
      option?: 'noaudio' | 'novideo';
    }
  | {
      command: 'in_queue';
      input: string;
    }
  | {
      command: 'addsubtitle';
      val: string;
    }
  | {
      command: 'volume';
      val: number | string;
    };

/**
 * @brief VLC boolean flags
 * @description This type defines the possible boolean flags that can be used in VLC media player commands.
 */
type VLCBooleanFlag =
  // Audio
  | '--audio'
  | '--no-audio'
  | '--spdif'
  | '--no-spdif'
  | '--force-dolby-surround'
  | '--stereo-mode'
  | '--audio-replay-gain-peak-protection'
  | '--no-audio-replay-gain-peak-protection'
  | '--audio-time-stretch'
  | '--no-audio-time-stretch'

  // Video
  | '--video'
  | '--no-video'
  | '--grayscale'
  | '--no-grayscale'
  | '--fullscreen'
  | '--no-fullscreen'
  | '--embedded-video'
  | '--no-embedded-video'
  | '--drop-late-frames'
  | '--no-drop-late-frames'
  | '--skip-frames'
  | '--no-skip-frames'
  | '--quiet-synchro'
  | '--no-quiet-synchro'
  | '--keyboard-events'
  | '--no-keyboard-events'
  | '--mouse-events'
  | '--no-mouse-events'
  | '--video-on-top'
  | '--no-video-on-top'
  | '--video-wallpaper'
  | '--no-video-wallpaper'
  | '--disable-screensaver'
  | '--no-disable-screensaver'
  | '--video-title-show'
  | '--no-video-title-show'
  | '--snapshot-preview'
  | '--no-snapshot-preview'
  | '--snapshot-sequential'
  | '--no-snapshot-sequential'
  | '--autoscale'
  | '--no-autoscale'
  | '--hdtv-fix'
  | '--no-hdtv-fix'
  | '--video-deco'
  | '--no-video-deco'

  // Subtitles/OSD
  | '--spu'
  | '--no-spu'
  | '--osd'
  | '--no-osd'
  | '--sub-autodetect-file'
  | '--no-sub-autodetect-file'

  // Playback
  | '--input-fast-seek'
  | '--no-input-fast-seek'
  | '--random'
  | '--no-random'
  | '--loop'
  | '--no-loop'
  | '--repeat'
  | '--no-repeat'
  | '--play-and-exit'
  | '--no-play-and-exit'
  | '--play-and-stop'
  | '--no-play-and-stop'
  | '--play-and-pause'
  | '--no-play-and-pause'
  | '--start-paused'
  | '--no-start-paused'
  | '--playlist-autostart'
  | '--no-playlist-autostart'
  | '--playlist-cork'
  | '--no-playlist-cork'

  // Interface
  | '--one-instance'
  | '--no-one-instance'
  | '--started-from-file'
  | '--no-started-from-file'
  | '--one-instance-when-started-from-file'
  | '--no-one-instance-when-started-from-file'
  | '--playlist-enqueue'
  | '--no-playlist-enqueue'
  | '--media-library'
  | '--no-media-library'
  | '--playlist-tree'
  | '--no-playlist-tree'
  | '--auto-preparse'
  | '--no-auto-preparse'
  | '--metadata-network-access'
  | '--no-metadata-network-access'
  | '--show-hiddenfiles'
  | '--no-show-hiddenfiles'
  | '--extractor-flatten'
  | '--no-extractor-flatten'
  | '--daemon'
  | '--no-daemon'
  | '--pidfile'
  | '--no-pidfile'
  | '--quiet'
  | '--no-quiet'

  // QT
  | '--qt-minimal-view'
  | '--no-qt-minimal-view'

  // Advanced
  | '--color'
  | '--no-color'
  | '--advanced'
  | '--no-advanced'
  | '--interact'
  | '--no-interact'
  | '--stats'
  | '--no-stats'
  | '--high-priority'
  | '--no-high-priority'
  | '--plugins-cache'
  | '--no-plugins-cache'
  | '--plugins-scan'
  | '--no-plugins-scan'
  | '--help'
  | '--no-help'
  | '--full-help'
  | '--no-full-help'
  | '--longhelp'
  | '--no-longhelp'
  | '--help-verbose'
  | '--no-help-verbose'
  | '--list'
  | '--no-list'
  | '--list-verbose'
  | '--no-list-verbose'
  | '--ignore-config'
  | '--no-ignore-config'
  | '--reset-config'
  | '--no-reset-config'
  | '--reset-plugins-cache'
  | '--no-reset-plugins-cache'
  | '--version'
  | '--no-version';

/**
 * @brief VLC value flags
 * @description This type defines the possible value flags that can be used in VLC media player commands.
 */
type VLCValueFlag =
  // Audio
  | `--gain=${number}`
  | `--volume-step=${number}`
  | `--force-dolby-surround=${0 | 1 | 2}` // Auto/On/Off
  | `--stereo-mode=${0 | 1 | 2 | 3 | 4 | 5 | 6}` // Unset/Stereo/Reverse/Left/Right/Dolby/Headphones
  | `--audio-desync=${number}`
  | `--audio-replay-gain-mode=${string}` // none/track/album
  | `--audio-replay-gain-preamp=${number}`
  | `--audio-replay-gain-default=${number}`
  | `--aout=${'mmdevice' | 'directsound' | 'waveout' | 'dummy'}` // mmdevice/directsound/waveout/etc
  | `--role=${string}` // video/music/communication/game/etc
  | `--audio-filter=${string}`
  | `--audio-visual=${string}` // goom/projectm/visual/etc
  | `--audio-resampler=${string}`

  // Video
  | `--video-title-timeout=${number}`
  | `--video-title-position=${0 | 1 | 2 | 4 | 5 | 6 | 8 | 9 | 10}`
  | `--mouse-hide-timeout=${number}`
  | `--snapshot-path=${string}`
  | `--snapshot-prefix=${string}`
  | `--snapshot-format=${string}` // png/jpg/tiff
  | `--snapshot-width=${number}`
  | `--snapshot-height=${number}`
  | `--width=${number}`
  | `--height=${number}`
  | `--video-x=${number}`
  | `--video-y=${number}`
  | `--crop=${string}` // aspect ratio like 4:3, 16:9
  | `--custom-crop-ratios=${string}`
  | `--aspect-ratio=${string}`
  | `--monitor-par=${string}`
  | `--custom-aspect-ratios=${string}`
  | `--video-title=${string}`
  | `--align=${0 | 1 | 2 | 4 | 5 | 6 | 8 | 9 | 10}`
  | `--zoom=${number}`
  | `--deinterlace=${-1 | 0 | 1}` // Automatic/Off/On
  | `--deinterlace-mode=${string}` // auto/discard/blend/mean/bob/etc
  | `--vout=${'direct3d11' | 'direct3d9' | 'gl' | 'directdraw' | 'dummy'}` // direct3d11/direct3d9/gl/etc
  | `--video-filter=${string}`
  | `--video-splitter=${string}`

  // Subtitles
  | `--sub-file=${string}`
  | `--sub-autodetect-fuzzy=${0 | 1 | 2 | 3 | 4}`
  | `--sub-autodetect-path=${string}`
  | `--sub-margin=${number}`
  | `--sub-text-scale=${number}` // 10-500
  | `--sub-source=${string}`
  | `--sub-filter=${string}`
  | `--text-renderer=${string}`

  // Tracks
  | `--program=${number}`
  | `--programs=${string}`
  | `--audio-track=${number}`
  | `--sub-track=${number}`
  | `--audio-language=${string}`
  | `--sub-language=${string}`
  | `--menu-language=${string}`
  | `--audio-track-id=${number}`
  | `--sub-track-id=${number}`
  | `--captions=${608 | 708}`
  | `--preferred-resolution=${-1 | 240 | 360 | 576 | 720 | 1080}`

  // Playback control
  | `--input-repeat=${number}` // 0-65535
  | `--start-time=${number}`
  | `--stop-time=${number}`
  | `--run-time=${number}`
  | `--rate=${number}`
  | `--input-list=${string}`
  | `--input-slave=${string}`
  | `--bookmarks=${string}`

  // Devices
  | `--dvd=${string}`
  | `--vcd=${string}`
  | `--cd-audio=${string}`

  // Network
  | `--mtu=${number}`
  | `--ipv4-timeout=${number}`
  | `--http-host=${string}`
  | `--http-password=${string}`
  | `--http-port=${number}` // 1-65535
  | `--https-port=${number}` // 1-65535
  | `--rtsp-host=${string}`
  | `--rtsp-port=${number}` // 1-65535
  | `--http-cert=${string}`
  | `--http-key=${string}`
  | `--http-proxy=${string}`
  | `--http-proxy-pwd=${string}`
  | `--socks=${string}`
  | `--socks-user=${string}`
  | `--socks-pwd=${string}`
  | `--rc-host=${string}` // host:port
  | `--rc-port=${number}` // 1-65535
  | `--rc-password=${string}`
  | `--rc-quiet=${0 | 1}` // 0=off, 1=on
  | `--rc-verbose=${0 | 1}` // 0=off, 1=on
  | `--rc-unix=${string}` // path to Unix socket
  | `--rc-unix-permissions=${string}` // e.g., "rwxrwxrwx"

  // Metadata
  | `--meta-title=${string}`
  | `--meta-author=${string}`
  | `--meta-artist=${string}`
  | `--meta-genre=${string}`
  | `--meta-copyright=${string}`
  | `--meta-description=${string}`
  | `--meta-date=${string}`
  | `--meta-url=${string}`

  // Caching
  | `--file-caching=${number}` // 0-60000
  | `--live-caching=${number}` // 0-60000
  | `--disc-caching=${number}` // 0-60000
  | `--network-caching=${number}` // 0-60000
  | `--cr-average=${number}`
  | `--clock-synchro=${-1 | 0 | 1}` // Default/Disable/Enable
  | `--clock-jitter=${number}`
  | `--input-record-path=${string}`
  | `--input-timeshift-path=${string}`
  | `--input-timeshift-granularity=${number}`
  | `--input-title-format=${string}`

  // Stream Output
  | `--sout=${string}`
  | `--sout-mux-caching=${number}`
  | `--vlm-conf=${string}`
  | `--sap-interval=${number}`
  | `--mux=${string}`
  | `--access_output=${string}`
  | `--ttl=${number}`
  | `--miface=${string}`
  | `--dscp=${number}`
  | `--packetizer=${string}`

  // QT
  | `--qt-notification=${0 | 1}` // 0=off, 1=on
  | `--qt-notification-timeout=${number}` // in milliseconds

  // Advanced
  | `--codec=${string}`
  | `--encoder=${string}`
  | `--access=${string}`
  | `--demux=${string}`
  | `--stream-filter=${string}`
  | `--demux-filter=${string}`
  | `--vod-server=${string}`
  | `--keystore=${string}`
  | `--clock-source=${string}`
  | `--recursive=${string}` // none/collapse/expand
  | `--ignore-filetypes=${string}`
  | `--services-discovery=${string}`
  | `--verbose=${0 | 1 | 2}`
  | `--intf=${'dummy' | 'rc' | 'http' | 'telnet' | 'qt' | 'skins2' | 'ncurses' | 'oldrc'}`
  | `--extraintf=${'dummy' | 'rc' | 'http' | 'telnet' | 'qt' | 'skins2' | 'ncurses' | 'oldrc'}`
  | `--control=${string}`
  | `--open=${string}`
  | `--preparse-timeout=${number}`
  | `--config=${string}`
  | `--module=${string}`
  | `--pidfile=${string}`
  | `--log=${string}`
  | `--logfile=${string}`
  | `--logmode=${string}` // text/html
  | `--syslog-facility=${string}`
  | `--syslog-ident=${string}`;

/**
 * @brief VLC short command line flag type
 * @description This type represents the various short command line flags that can be used with VLC.
 */
type VLCShortFlag =
  | '-f' // fullscreen
  | '-A' // audio output
  | '-V' // video output
  | '-Z' // random
  | '-L' // loop
  | '-R' // repeat
  | '-S' // services-discovery
  | '-v' // verbose
  | '-I' // interface
  | '-q' // quiet
  | '-h' // help
  | '-H' // full-help
  | '-l' // list
  | '-p' // module help
  | '-d'; // daemon

/**
 * @brief VLC command line flag type
 * @description This type represents the various command line flags that can be used with VLC.
 */
export type VLCCliFlag = VLCBooleanFlag | VLCValueFlag | VLCShortFlag;

/**
 * @brief VLC Player State - all possible states
 * @description This type defines the possible states of the VLC media player.
 */
export type VLCPlayerState = 'playing' | 'paused' | 'stopped' | 'opening' | 'buffering' | 'ended' | 'error';

/**
 * @brief Video Effects Configuration
 * @description This interface defines the structure for video effects in VLC media player.
 */
export interface VLCVideoEffects {
  /** Brightness level (typically 0-2, default 1) */
  brightness: number;
  /** Saturation level (typically 0-3, default 1) */
  saturation: number;
  /** Gamma correction (typically 0.01-10, default 1) */
  gamma: number;
  /** Contrast level (typically 0-2, default 1) */
  contrast: number;
  /** Hue adjustment in degrees (typically -180 to 180, default 0) */
  hue: number;
}

/**
 * @brief Audio Filters Configuration - dynamic keys for multiple filters
 * @description This interface defines the structure for audio filters in VLC media player.
 */
export interface VLCAudioFilters {
  /** Dynamic audio filter entries */
  [key: `filter_${number}`]: string;
}

/**
 * @brief Stream Types for media information
 * @description This type defines the possible stream types in VLC media player.
 */
export type VLCStreamType = 'Video' | 'Audio' | 'Subtitle' | 'Data';

/**
 * @brief Video Stream Information
 * @description This interface defines the structure for video stream information in VLC media player.
 */
export interface VLCVideoStreamInfo {
  Type: 'Video';
  Codec: string;
  /** Video resolution in format "WIDTHxHEIGHT" */
  Video_resolution: string;
  /** Buffer dimensions in format "WIDTHxHEIGHT" */
  Buffer_dimensions: string;
  /** Frame rate as string number */
  Frame_rate: string;
  /** Decoded format description */
  Decoded_format: string;
  /** Video orientation */
  Orientation: string;
  /** Color transfer function */
  Color_transfer_function: string;
  /** Color space information */
  Color_space: string;
  /** Color primaries */
  Color_primaries: string;
  /** Chroma location */
  Chroma_location: string;
  /** Language code */
  Language?: string;
}

/**
 * @brief Audio Stream Information
 * @description This interface defines the structure for audio stream information in VLC media player.
 */
export interface VLCAudioStreamInfo {
  Type: 'Audio';
  Codec: string;
  /** Language code */
  Language: string;
  /** Sample rate with Hz unit */
  Sample_rate: string;
  /** Audio channel configuration */
  Channels?: string;
  /** Bits per sample as string */
  Bits_per_sample?: string;
  /** AAC extension type */
  AAC_extension?: string;
  /** Stream description */
  Description?: string;
}

/**
 * @brief Subtitle Stream Information
 * @description This interface defines the structure for subtitle stream information in VLC media player.
 */
export interface VLCSubtitleStreamInfo {
  Type: 'Subtitle';
  Codec: string;
  /** Language code */
  Language: string;
  /** Subtitle description */
  Description: string;
}

/**
 * @brief Generic Stream Information
 * @description This interface defines the structure for generic stream information in VLC media player.
 */
export interface VLCGenericStreamInfo {
  Type: VLCStreamType;
  Codec: string;
  Language?: string;
  Description?: string;
  [key: string]: any;
}

/**
 * @brief Union type for VLC stream information
 * @description This type represents all possible stream information types in VLC media player.
 */
export type VLCStreamInfo = VLCVideoStreamInfo | VLCAudioStreamInfo | VLCSubtitleStreamInfo | VLCGenericStreamInfo;

/**
 * @brief Media Metadata Information
 * @description This interface defines the structure for media metadata in VLC media player.
 */
export interface VLCMediaMeta {
  /** Total number of bytes */
  NUMBER_OF_BYTES: string;
  /** Statistics tags */
  _STATISTICS_TAGS: string;
  /** Original filename */
  filename: string;
  /** Total number of frames */
  NUMBER_OF_FRAMES: string;
  /** Statistics writing date in UTC */
  _STATISTICS_WRITING_DATE_UTC: string;
  /** Application used for writing */
  _STATISTICS_WRITING_APP: string;
  /** Media duration in HH:MM:SS.milliseconds format */
  DURATION: string;
  /** Bits per second as string */
  BPS: string;
  /** Additional metadata fields */
  [key: string]: string;
}

/**
 * @brief Media Information Categories
 * @description This interface defines the structure for categorized media information in VLC media player.
 */
export interface VLCMediaCategory {
  /** Dynamic stream entries - Stream 0, Stream 1, etc. */
  [key: `Stream ${number}`]: VLCStreamInfo;
  /** Media metadata */
  meta: VLCMediaMeta;
}

/**
 * @brief VLC media information interface
 * @description This interface defines the structure for media information in VLC media player.
 */
export interface VLCMediaInformation {
  /** Available chapters as array of numbers */
  chapters: number[];
  /** Current chapter index */
  chapter: number;
  /** Available titles as array of numbers */
  titles: number[];
  /** Current title index */
  title: number;
  /** Categorized media information */
  category: VLCMediaCategory;
}

/**
 * @brief VLC playback statistics interface
 * @description This interface defines the structure for playback statistics in VLC media player.
 */
export interface VLCPlaybackStats {
  /** Number of decoded video frames */
  decodedvideo: number;
  /** Number of decoded audio frames */
  decodedaudio: number;
  /** Number of lost audio buffers */
  lostabuffers: number;
  /** Total bytes sent */
  sentbytes: number;
  /** Number of played audio buffers */
  playedabuffers: number;
  /** Send bitrate */
  sendbitrate: number;
  /** Number of corrupted demux packets */
  demuxcorrupted: number;
  /** Number of sent packets */
  sentpackets: number;
  /** Average demux bitrate */
  averagedemuxbitrate: number;
  /** Number of demux read packets */
  demuxreadpackets: number;
  /** Number of read packets */
  readpackets: number;
  /** Total bytes read */
  readbytes: number;
  /** Average input bitrate */
  averageinputbitrate: number;
  /** Number of displayed pictures */
  displayedpictures: number;
  /** Demux read bytes */
  demuxreadbytes: number;
  /** Current input bitrate */
  inputbitrate: number;
  /** Number of lost pictures */
  lostpictures: number;
  /** Demux discontinuity count */
  demuxdiscontinuity: number;
  /** Current demux bitrate */
  demuxbitrate: number;
}

/**
 * @brief VLC status interface
 * @description This interface defines the structure for the status of the VLC media player.
 */
export interface VLCStatus {
  /** API version number */
  apiversion: number;
  /** Current aspect ratio setting */
  aspectratio: string;
  /** Total media length in seconds */
  length: number;
  /** Equalizer settings array */
  equalizer: unknown[];
  /** Current volume level (0-512, where 256 is 100%) */
  volume: number;
  /** VLC version string */
  version: string;
  /** Video effects configuration */
  videoeffects: VLCVideoEffects;
  /** Audio filters configuration */
  audiofilters: VLCAudioFilters;
  /** Current playback state */
  state: VLCPlayerState;
  /** Repeat mode enabled */
  repeat: boolean;
  /** Fullscreen mode enabled */
  fullscreen: boolean;
  /** Loop mode enabled */
  loop: boolean;
  /** Detailed media information */
  information: VLCMediaInformation;
  /** Current position as decimal (0.0 to 1.0) */
  position: number;
  /** Detailed playback statistics */
  stats: VLCPlaybackStats;
  /** Current playlist ID */
  currentplid: number;
  /** Seek increment in seconds */
  seek_sec: number;
  /** Random/shuffle mode enabled */
  random: boolean;
  /** Audio delay in milliseconds */
  audiodelay: number;
  /** Playback rate (1.0 = normal speed) */
  rate: number;
  /** Current playback time in seconds */
  time: number;
  /** Subtitle delay in milliseconds */
  subtitledelay: number;
}
