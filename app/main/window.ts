/** Dependencies */
import { BrowserWindow, ipcMain } from 'electron';

/** Webpack Constants */
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

/**
 * @brief Represents a window in the application.
 * @description This class manages the main application window.
 * It is responsible for handling events and interactions with the window.
 */
export class MoonWindow {
  private win: BrowserWindow | null = null;

  /**
   * @brief Creates an instance of the Window class.
   * @description Initializes the main application window with specified properties.
   */
  constructor() {
    // Setup the Window
    this.win = new BrowserWindow({
      width: 1920,
      height: 1080,
      alwaysOnTop: true,
      frame: false,
      resizable: false,
      fullscreen: true,
      show: false,
      title: 'Moon HTPC',
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        nodeIntegration: true
      }
    });

    // Show the window once it is ready
    this.win.once('ready-to-show', () => {
      if (process.argv.includes('--hide-window')) {
        this.win?.hide();
      } else {
        this.win?.show();
      }
    });

    // Handle window close event
    this.win.on('close', () => {
      this.win = null;
    });

    // Load the main entry point of the application
    this.win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  }

  /**
   * @brief Closes the window.
   * @description This method closes the main application window.
   */
  public show(): void {
    this.win?.show();
  }

  /**
   * @brief Hides the window.
   * @description This method hides the main application window.
   */
  public hide(): void {
    this.win?.hide();
  }

  /**
   * @brief Checks if the window is visible.
   * @returns {boolean} True if the window is visible, false otherwise.
   */
  public isVisible(): boolean {
    return this.win?.isVisible() || false;
  }

  /**
   * @brief Gets the current window instance.
   * @returns {BrowserWindow | null} The current BrowserWindow instance or null if not initialized.
   */
  public getWindow(): BrowserWindow | null {
    return this.win;
  }

  /**
   * @brief Destroys the window instance.
   * @description This method cleans up the window instance and removes it from memory.
   */
  public destroy(): void {
    this.win?.close();
    this.win = null;
  }

  /**
   * @brief Focuses the window.
   * @description This method brings the window to the front and focuses it.
   */
  public focus(): void {
    this.win?.focus();
  }
}
