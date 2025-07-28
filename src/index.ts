import { app, BrowserWindow } from 'electron';
import { application } from './app';

if (require('electron-squirrel-startup')) {
  app.quit();
}

application.serve();

app.on('ready', application.create);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    application.create();
  }
});
