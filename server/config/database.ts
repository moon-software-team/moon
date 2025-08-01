/** Dependencies */
import path from 'path';
import { Sequelize } from 'sequelize';
import { setup } from '@/config/setup';
import { initModels } from '@server/models';

/**
 * @brief Synchronize the database.
 * @description This function initializes the database connection using Sequelize.
 * It checks if the `process.moon` object exists, and if not, it calls the `setup` function to ensure the application is properly configured.
 * The database is stored in a SQLite file located at `process.moon.appfolder/data/database.db`.
 * The Sequelize instance is assigned to `process.moon.database`.
 */
export const synchronizeDatabase = async () => {
  // Ensure the moon object exists on process
  if (!process.moon) {
    setup();
  }

  // Define the database path
  const dbPath = path.join(process.moon.appfolder, 'data/database.db');

  // Create a new Sequelize instance
  process.moon.database = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false
  });

  // Initialize models
  initModels(process.moon.database);

  // Synchronize the database
  try {
    await process.moon.database.sync({ force: false });
    console.log('Database synchronized successfully.');
  } catch (error) {
    throw new Error(`Failed to synchronize the database: ${error.message}`);
  }
};
