import type { Configuration } from 'webpack';
import path from 'path';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
});

export const rendererConfig: Configuration = {
  module: {
    rules
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
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
