import { BrowserWindow } from 'electron';
import path from 'path';
import { startServer } from '../server';
import argv from '../config';
import { EventBus } from '../types';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

type ApplicationEvents = {
  'close': void;
  'create': void;
  'show': void;
  'hide': void;
  'focus': void;
  'serve': void;
};

class Application extends EventBus<ApplicationEvents> {
  private window: BrowserWindow | null = null;
  private serverStarted: boolean = false;

  /**
   * @brief Initializes the server.
   */
  public serve(): void {
    if (this.serverStarted) {
      console.warn('Server is already running.');
      return;
    }

    let staticPath: string = path.dirname(MAIN_WINDOW_WEBPACK_ENTRY);

    if (staticPath.startsWith('http')) {
      staticPath = path.join(__dirname, '../renderer/main_window');
    }

    startServer(staticPath);

    this.serverStarted = true;

    this.emit('serve');
  }

  /**
   * @brief Creates the main application window.
   */
  public create(): void {
    this.window = new BrowserWindow({
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

    this.window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    if (argv['hide-window']) {
      this.window.hide();
    }

    this.emit('create');
  }

  /**
   * @brief Shows the main application window if it exists, otherwise logs a warning.
   */
  public show(): void {
    if (this.window) {
      this.window.show();
      this.window.focus();
      this.emit('show');
    } else {
      console.warn('Window is not created yet.');
    }
  }

  /**
   * @brief Hides the main application window if it exists, otherwise logs a warning.
   */
  public hide(): void {
    if (this.window) {
      this.window.hide();
      this.emit('hide');
    } else {
      console.warn('Window is not created yet.');
    }
  }

  /**
   * @brief Toggle the visibility of the main application window.
   */
  public toggleVisibility(): void {
    if (this.window) {
      if (this.window.isVisible()) {
        this.hide();
      } else {
        this.show();
      }
    } else {
      console.warn('Window is not created yet.');
    }
  }

  /**
   * @brief Focuses the main application window if it exists, otherwise logs a warning.
   */
  public focus(): void {
    if (this.window) {
      this.window.focus();
      this.emit('focus');
    } else {
      console.warn('Window is not created yet.');
    }
  }

  /**
   * @brief Closes the main application window if it exists, otherwise logs a warning.
   */
  public close(): void {
    if (this.window) {
      this.window.close();
      this.window = null;
      this.emit('close');
    } else {
      console.warn('Window is not created yet.');
    }
  }
}

export const application = new Application();
