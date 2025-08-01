import type { Configuration } from 'webpack';
import path from 'path';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './app/index.ts',
  // Put your normal webpack config below here
  module: {
    rules
  },
  plugins,
  externals: {
    sqlite3: 'commonjs sqlite3',
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {
      '@': __dirname,
      '@app': path.resolve(__dirname, './app'),
      '@server': path.resolve(__dirname, './server'),
      '@utils': path.resolve(__dirname, './utils'),
      '@services': path.resolve(__dirname, './server/services'),
      '@controllers': path.resolve(__dirname, './server/controllers'),
      '@middlewares': path.resolve(__dirname, './server/middlewares'),
      '@models': path.resolve(__dirname, './server/models'),
      '@routes': path.resolve(__dirname, './server/routes'),
      '@config': path.resolve(__dirname, './config'),
      '@types': path.resolve(__dirname, './types'),
      '@validators': path.resolve(__dirname, './server/validators')
    }
  }
};
