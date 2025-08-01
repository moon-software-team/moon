/** Dependencies */
import { setup } from '@config/setup';
import { app } from 'electron';
import { MoonWindow } from '@/app/main';
import { MoonServer } from '@/server';
import { VLCPlayer } from '@/server/services';

/** Quit if the app is launched by Squirrel */
if (require('electron-squirrel-startup')) {
  app.quit();
}

/** Initialize the Moon application */
app.on('ready', () => {
  /** Initialize the Moon namespace on process */
  if (!process.moon) {
    process.moon = {
      status: 'loading'
    };
  }

  /** Setup application directories */
  setup();

  /** Initialize the Moon window */
  process.moon.window = new MoonWindow();

  /** Initialize the Moon server */
  process.moon.server = new MoonServer({
    port: 45001
  });

  /** Initialize the Moon player */
  process.moon.player = new VLCPlayer();

  /** Start the server */
  process.moon.server.start().catch((error) => {
    console.error('Failed to start the server:', error);
  });
});

/** Handle application activation */
app.on('activate', () => {
  // Initialize moon namespace if it doesn't exist
  if (!process.moon) {
    process.moon = {
      status: 'loading'
    };
  }

  // Show the window if it exists, otherwise create a new one
  if (process.moon.window) {
    process.moon.window.show();
  } else {
    process.moon.window = new MoonWindow();
  }
});

/** Quit the application when all windows are closed */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
