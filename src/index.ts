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
