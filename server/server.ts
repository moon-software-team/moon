/** Dependencies */
import express from 'express';
import { createServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import { ServerOptions } from '@server/types';
import { synchronizeDatabase } from '@server/config';
import router from '@server/routes';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { onConnection } from '@server/connection';
import fs from 'fs';
import { plex } from '@server/services';

/** Webpack Constants */
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

/**
 * @brief Server class for handling HTTP and WebSocket connections.
 * @description This class sets up an Express server and a Socket.IO server for real-time
 * communication. It allows configuration of the server's host, port, and socket options.
 */
export class MoonServer {
  private app: express.Express | null = null;
  private httpServer: ReturnType<typeof createServer> | null = null;
  private io: SocketIOServer | null = null;

  /**
   * @brief Constructor for the Server class.
   * @param options - Configuration options for the server.
   */
  constructor(private options: ServerOptions = {}) {
    // Set default options if not provided
    this.options.port = this.options.port || 45001;
    this.options.host = this.options.host || '0.0.0.0';
    this.options.socketOptions = this.options.socketOptions || {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
      }
    };

    // Initialize the Express app and HTTP server
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, this.options.socketOptions);

    // Set up the Plex service
    plex.init();

    // Set up the connection handler for Socket.IO
    this.io.on('connection', (socket) => onConnection(this.io!, socket));

    // Set the static path for serving files
    this.app.use(express.static(this.getStaticPath()));

    // Set up middleware and routes
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use('/', router);
  }

  /**
   * @brief Returns the path to the static files directory.
   * @description This method determines the static path based on the MAIN_WINDOW_WEBPACK_ENTRY constant
   * and ensures it is a valid file path. If the path starts with 'http', it uses the default renderer path.
   * If it starts with 'file://', it converts it to a file path.
   * @returns The path to the public directory where static files are served.
   */
  private getStaticPath(): string {
    // Determine the static path based on the MAIN_WINDOW_WEBPACK_ENTRY constant
    let staticPath = path.dirname(MAIN_WINDOW_WEBPACK_ENTRY);

    // If the path starts with 'http', it indicates a remote URL, so we use the default renderer path
    if (staticPath.startsWith('http')) {
      staticPath = path.join(__dirname, '../renderer/main_window');
    }

    // If the path starts with 'file://', convert it to a file path
    if (staticPath.startsWith('file://')) {
      staticPath = fileURLToPath(staticPath);
    }

    // Return the full path to the public directory
    return path.join(staticPath, 'public');
  }

  /**
   * @brief Retrieves the LAN IP address of the server.
   * @description This method checks the network interfaces of the server to find a suitable LAN IP address.
   * It prioritizes private network addresses (like 192.168.x.x, 10.x.x.x, and 172.16.x.x to 172.31.x.x)
   * and falls back to the first non-APIPA address if no private address is found.
   * If no suitable LAN IP is found, it defaults to 'localhost'.
   * @returns The LAN IP address as a string.
   */
  private getLanIPAddress() {
    const networkInterfaces = os.networkInterfaces();
    let lanIP = 'localhost';
    let fallbackIP = '';

    const isPrivateNetwork = (ip: string): boolean => {
      const parts = ip.split('.').map(Number);
      if (parts[0] === 192 && parts[1] === 168) return true;
      if (parts[0] === 10) return true;
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
      return false;
    };

    const isAPIPA = (ip: string): boolean => {
      const parts = ip.split('.').map(Number);
      return parts[0] === 169 && parts[1] === 254;
    };

    for (const interfaceName in networkInterfaces) {
      const interfaces = networkInterfaces[interfaceName];
      if (interfaces) {
        for (const iface of interfaces) {
          if (iface.family === 'IPv4' && !iface.internal) {
            if (isPrivateNetwork(iface.address)) {
              lanIP = iface.address;
              break;
            } else if (!isAPIPA(iface.address) && !fallbackIP) {
              fallbackIP = iface.address;
            } else if (isAPIPA(iface.address) && !fallbackIP) {
              fallbackIP = iface.address;
            }
          }
        }
        if (lanIP !== 'localhost') break;
      }
    }

    if (lanIP === 'localhost' && fallbackIP) {
      lanIP = fallbackIP;
    }

    return lanIP;
  }

  /**
   * @brief Starts the server and listens for incoming connections.
   * @returns A promise that resolves when the server is successfully started.
   * @throws Error if the server is not properly initialized.
   */
  public async start(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Ensure the server is initialized
      if (!this.app || !this.httpServer || !this.io) {
        reject(new Error('Server is not properly initialized.'));
      }

      // Synchronize the database
      try {
        // await synchronizeDatabase(); // Uncomment if database synchronization is needed
      } catch (error) {
        reject(new Error(error.message));
        return;
      }

      // Start the HTTP server
      this.httpServer.listen(this.options.port, this.options.host, () => {
        console.log(`Server is running at http://${this.options.host}:${this.options.port}`);
        console.log(`LAN IP Address: http://${this.getLanIPAddress()}:${this.options.port}`);
        resolve();
      });

      // Start ambient music if configured
      await this.startAmbientMusic();
    });
  }

  /**
   * @brief Stops the server and closes all connections.
   * @returns A promise that resolves when the server is successfully stopped.
   * @throws Error if the server is not properly initialized.
   */
  public async stop(): Promise<void> {
    // Ensure the server is initialized
    if (!this.httpServer) {
      throw new Error('Server is not properly initialized.');
    }

    // Stop the HTTP server
    return new Promise((resolve, reject) => {
      this.httpServer.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Server has been stopped.');
          resolve();
        }
      });
    });
  }

  /**
   * @brief Returns the Socket.IO server instance.
   * @returns The Socket.IO server instance.
   * @throws Error if the Socket.IO server is not initialized.
   */
  public getSocketServer(): SocketIOServer {
    if (!this.io) {
      throw new Error('Socket.IO server is not initialized.');
    }
    return this.io;
  }

  /**
   * @brief Emits an event to all connected clients.
   * @param event - The name of the event to emit.
   * @param args - The arguments to pass with the event.
   * @returns A boolean indicating whether the event was successfully emitted.
   * @throws Error if the Socket.IO server is not initialized.
   */
  public emitToSockets(event: string, ...args: any[]): boolean {
    if (!this.io) {
      throw new Error('Socket.IO server is not initialized.');
    }
    return this.io.emit(event, ...args);
  }

  public async startAmbientMusic(): Promise<void> {
    // Check if the music directory is configured
    const files = fs.readdirSync(path.resolve(process.moon.config.musicDirectory)).filter((file) => {
      return file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.ogg');
    });

    // If no files are found, log a warning
    if (files.length === 0) {
      console.warn('No ambient music files found in the specified directory.');
      return;
    }

    // Check if the player is already playing
    if (process.moon.status === 'playing') {
      throw new Error('The player is being used by another instance.');
    }

    // Set the player status to ambient
    process.moon.status = 'ambient';

    // If the is already open, do not start a new player
    if (process.moon.player.isOpen()) {
      return;
    }

    try {
      // Open the player with the selected file
      await process.moon.player.open(path.resolve(process.moon.config.musicDirectory), ['--no-video', '--random']);

      // Set the player volume to 50%
      await process.moon.player.setVolume(256 * 0.5);

      // Log the number of queued files
      console.log(`Queued ambient music: ${files.length} files found.`);
    } catch (error) {
      console.error('Failed to start ambient music:', error);
      throw new Error('Failed to start ambient music.');
    }
  }
}
