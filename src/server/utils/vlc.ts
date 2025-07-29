export const getDefaultVLCPath = (): string => {
  // Default VLC paths for different platforms
  switch (process.platform) {
    case 'win32':
      return 'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe';
    case 'darwin':
      return '/Applications/VLC.app/Contents/MacOS/VLC';
    case 'linux':
      return 'vlc';
    default:
      return 'vlc';
  }
};
