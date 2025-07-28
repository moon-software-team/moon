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

// import { spawn } from 'child_process';

// const ezio = `/home/mallow/Music/OnTheSpot/Tracks/Jesper Kyd/[2009] Assassin's Creed 2 (Original Game Soundtrack)/3. Ezio's Family.mp3`;

// const vlcArgs = [
//   ezio,
//   '--intf',
//   'dummy', // no interface
//   '--no-video', // no video output
//   '--quiet', // minimal output
//   '--play-and-exit' // exit after playback
// ];

// const vlc = spawn('vlc', vlcArgs, {
//   stdio: 'ignore'
// });

// process.on('exit', () => {
//   vlc.kill();
// });
// process.on('SIGINT', () => {
//   vlc.kill();
//   process.exit();
// });
// process.on('SIGTERM', () => {
//   vlc.kill();
//   process.exit();
// });

// import { vlc } from './server/services';

// (async () => {
//   const filepath = "/home/mallow/Code/Personal/moon-htpc/video.webm";

//   await vlc.openFile(filepath, "video");

//   setTimeout(() => {
//     vlc.close();
//   }, 2e3);
// })()
