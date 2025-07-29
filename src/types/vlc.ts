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
}

export interface BaseTrack {
  id: number;
  name: string;
  language?: string;
  selected: boolean;
}

export interface VideoTrack extends BaseTrack {
  forced?: boolean;
}

export interface AudioTrack extends BaseTrack {
  channel?: number;
}

export interface SubtitleTrack extends BaseTrack {
  forced?: boolean;
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
  | `seek ${number | string}`
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
  | 'playlist'
  | 'zoom'
  | 'vdeinterlace'
  | 'vdeinterlace_mode'
  | 'strack'
  | 'status'
  | 'info'
  | 'stats'
  | 'get_time'
  | 'is_playing'
  | 'get_title'
  | 'get_length'
  | 'search'
  | 'help'
  | 'longhelp';

// Boolean flags (can be --flag or --no-flag)
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

// Value-based flags (require a parameter)
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

// Short flags (single letter)
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

// Combined type for all VLC CLI flags
export type VLCCliFlag = VLCBooleanFlag | VLCValueFlag | VLCShortFlag;
