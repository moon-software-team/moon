import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { IgnorePlugin } from 'webpack';

export const plugins = [
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'app', 'assets'),
        to: path.resolve(__dirname, '.webpack/renderer/main_window', 'assets')
      },
      {
        from: path.resolve(__dirname, 'public'),
        to: path.resolve(__dirname, '.webpack/renderer/main_window', 'public')
      }
    ]
  }),
  new IgnorePlugin({
    resourceRegExp: /^(pg|pg-hstore|mysql2|tedious|oracledb)$/
  })
];
