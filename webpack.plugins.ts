import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export const plugins = [
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'src', 'assets'),
        to: path.resolve(__dirname, '.webpack/renderer/main_window', 'assets')
      },
      {
        from: path.resolve(__dirname, 'src', 'public'),
        to: path.resolve(__dirname, '.webpack/renderer/main_window', 'public')
      }
    ]
  })
];
