import { app, BrowserWindow } from 'electron';
import { startServer } from './server';
import path from 'path';
import argv from './config';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  let staticPath: string = path.dirname(MAIN_WINDOW_WEBPACK_ENTRY);

  if (staticPath.startsWith('http')) {
    staticPath = path.join(__dirname, '../renderer/main_window');
  }

  startServer(staticPath);

  const mainWindow = new BrowserWindow({
    height: 1080,
    width: 1920,
    title: 'Moon',
    alwaysOnTop: true,
    frame: false,
    resizable: false,
    fullscreen: true,
    icon: path.join(path.dirname(MAIN_WINDOW_WEBPACK_ENTRY), 'assets/images', '192x192.png'),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (argv['hide-window']) {
    mainWindow.hide();
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
