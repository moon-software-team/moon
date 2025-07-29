import './app';
import { app, BrowserWindow } from 'electron';

if (require('electron-squirrel-startup')) {
  app.quit();
}

process.moon.serve();

app.on('ready', process.moon.create);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    process.moon.create();
  }
});

// import { VLC } from './utils';

// const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// const vlc = new VLC();

// (async () => {
//   await vlc.open(
//     [
//       '--fullscreen',
//       '--no-video-title-show',
//       '--no-osd',
//       '--no-random',
//       '--no-loop',
//       '--no-repeat',
//       '--video-on-top',
//       '--no-embedded-video',
//       '--qt-minimal-view',
//       '--qt-notification=0',
//       '--extraintf=dummy'
//     ],
//     '/home/mallow/Téléchargements/Elemental.2023.MULTI.VFF.1080p.WEBRip.7.1x265-Elcrackito/Elemental.2023.MULTI.VFF.1080p.WEBRip.7.1x265-Elcrackito.mkv'
//   );

//   const duration = await vlc.getLength();
//   console.log('Duration:', duration);

//   const tracks = await vlc.getAudioTracks();
//   console.log('Audio Tracks:', tracks);

//   await vlc.setAudioTrack(1);

//   await vlc.seek(100);

//   await sleep(10000);

//   await vlc.stop();
// })();
