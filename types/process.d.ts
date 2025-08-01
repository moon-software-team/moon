/** Dependencies */
import { MoonServer } from '@/server';
import { VLCPlayer } from '@/server/services';
import { MoonWindow } from '@/app/main';
import { MoonConfig } from '@/config';
import { MoonStatus } from './status';
import { Sequelize } from 'sequelize';

/** Modify Process Interface */
declare global {
  namespace NodeJS {
    interface Process {
      /**
       * @brief Custom properties for the Moon application.
       * @description This interface extends the NodeJS Process interface to include
       * properties specific to the Moon application, such as the server and window instances.
       */
      moon: {
        /**
         * @brief Instance of the MoonServer class.
         * @description This property holds the instance of the MoonServer, which manages
         * the HTTP and WebSocket connections for the Moon application.
         */
        server?: MoonServer;

        /**
         * @brief Instance of the MoonWindow class.
         * @description This property holds the instance of the MoonWindow, which manages
         * the main application window for the Moon application.
         */
        window?: MoonWindow;

        /**
         * @brief Sequelize database instance.
         * @description This property holds the Sequelize instance used for database operations
         * within the Moon application, allowing for interaction with the application's database.
         */
        database?: Sequelize;

        /**
         * @brief Application folder path.
         * @description This property holds the path to the application folder, which can be used
         * to store or retrieve application-specific files.
         */
        appfolder?: string;

        /**
         * @brief Application configuration.
         * @description This property holds the configuration settings for the Moon application,
         * which can be used to customize the application's behavior.
         */
        config?: MoonConfig;

        /**
         * @brief VLC Player instance.
         * @description This property holds the instance of the VLCPlayer, which is used to control
         * media playback within the Moon application. It provides methods to play, pause, stop,
         * and manage media playback.
         */
        player?: VLCPlayer;

        /**
         * @brief Current status of the Moon application.
         * @description This property holds the current status of the Moon application, which can
         * be used to determine the application's state, such as whether it is running, paused,
         * or stopped.
         */
        status?: MoonStatus;
      };
    }
  }
}

/** Setup base Moon application properties */
process.moon = {
  status: 'off'
};
