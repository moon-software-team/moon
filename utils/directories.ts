/** Dependencies */
import fs from 'fs';

/** Application data directory */
export const LOCALAPPDATA =
  process.env.LOCALAPPDATA ||
  (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share');

/**
 * @brief Setup directories based on a tree structure.
 * @param tree - An object representing the directory structure.
 * @param basePath - The base path where the directories will be created.
 * @description This function recursively creates directories based on the provided tree structure.
 * Each key in the object represents a directory name, and if the value is an object,
 * it indicates that the directory should contain subdirectories.
 * If the value is a string, it indicates a file to be created in that directory.
 *
 * @example
 * const tree = {
 *   'dir1': {
 *     'subdir1': {},
 *     'file.txt': 'Content of file.txt',
 *   },
 *   'dir2': {}
 * };
 * setupDirectories(tree, '/path/to/base');
 */
export const setupDirectories = (tree: object, basePath: string): void => {
  for (const [key, value] of Object.entries(tree)) {
    const targetPath = `${basePath}/${key}`;
    if (typeof value === 'object' && value !== null) {
      // Create the directory if it doesn't exist
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      setupDirectories(value, targetPath);
    } else if (typeof value === 'string') {
      // Ensure parent directory exists
      const parentDir = require('path').dirname(targetPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      // Create the file with the given content if it doesn't exist
      if (!fs.existsSync(targetPath)) {
        fs.writeFileSync(targetPath, value, { encoding: 'utf8' });
      }
    }
  }
};
