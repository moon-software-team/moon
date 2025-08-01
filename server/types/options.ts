/** Dependencies */
import { HTTPMethod, HTTPHeader, HTTPOrigin } from './http';

/**
 * @brief Interface for configuring server options.
 * @description This interface defines the options available for configuring the server,
 * including the port, host, and Socket.IO options.
 */
export interface ServerOptions {
  /**
   * @description The port on which the server will listen for incoming connections.
   * @type {number}
   * @default 45001
   */
  port?: number;

  /**
   * @description The host address for the server.
   * @type {string}
   * @default '0.0.0.0'
   */
  host?: string;

  /**
   * @description Options for configuring the Socket.IO server.
   * @type {object}
   * @property {object} [cors] - CORS configuration for the Socket.IO server
   * @property {HTTPOrigin|HTTPOrigin[]} [cors.origin] - Allowed origins for CORS requests
   * @property {HTTPMethod[]} [cors.methods] - Allowed HTTP methods for CORS requests
   * @property {HTTPHeader[]} [cors.allowedHeaders] - Allowed headers for CORS requests
   * @property {boolean} [cors.credentials] - Whether to allow credentials in CORS requests
   * @default { cors: { origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'], credentials: true } }
   */
  socketOptions?: {
    /**
     * @description CORS configuration for the Socket.IO server.
     * @type {object}
     * @property {HTTPOrigin|HTTPOrigin[]} [origin] - Allowed origins for CORS requests.
     * @property {HTTPMethod[]} [methods] - Allowed HTTP methods for CORS requests.
     * @property {HTTPHeader[]} [allowedHeaders] - Allowed headers for CORS requests.
     * @property {boolean} [credentials] - Whether to allow credentials in CORS requests.
     * @default { origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'], credentials: true }
     */
    cors?: {
      /**
       * @description Allowed origins for CORS requests.
       * @type {HTTPOrigin|HTTPOrigin[]}
       * @default '*'
       */
      origin?: HTTPOrigin | HTTPOrigin[];

      /**
       * @description This specifies which HTTP methods are allowed for CORS requests.
       * @type {HTTPMethod[]}
       * @default ['GET', 'POST']
       */
      methods?: HTTPMethod[];

      /**
       * @description This specifies which headers are allowed in CORS requests.
       * @type {HTTPHeader[]}
       * @default ['Content-Type']
       */
      allowedHeaders?: HTTPHeader[];

      /**
       * @description Whether to allow credentials in CORS requests.
       * @type {boolean}
       * @default true
       */
      credentials?: boolean;
    };
  };
}
