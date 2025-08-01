/**
 * @brief Moon HTPC Configuration Interface
 * @description This interface defines the structure for the Moon HTPC configuration.
 * It includes properties for the application data directory, configuration file path,
 * and other relevant settings.
 */
export interface MoonConfig {
  /**
   * @brief Server configuration
   * @description This object contains the server settings such as port and host.
   * @property port - The port on which the server will run.
   * @property host - The host address for the server.
   */
  server: {
    /**
     * @brief Port number for the server
     * @description The port on which the server will listen for incoming requests.
     * @default 45001
     */
    port: number;

    /**
     * @brief Host address for the server
     * @description The host address for the server, typically 'localhost' or an IP address
     * @default '0.0.0.0'
     */
    host: string;
  },

  /**
   * @brief Directory for the ambient music
   * @description This property specifies the directory where ambient music files are stored.
   * @default '.'
   */
  musicDirectory: string;
}
