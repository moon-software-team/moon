import yargs from 'yargs';
import { setupDirectories } from './directory';
import { loadConfig } from './config';
import { hideBin } from 'yargs/helpers';

setupDirectories();
loadConfig();

const argv = yargs(hideBin(process.argv))
  .option('hide-window', {
    type: 'boolean',
    description: 'Start the app without showing the main window',
    default: false
  })
  .option('port', {
    type: 'number',
    description: 'Define the server port',
    default: process.moonConfig.server.port
  })
  .option('vlc-port', {
    type: 'number',
    description: 'Define the VLC http server port',
    default: process.moonConfig.vlc.port
  })
  .option('vlc-password', {
    type: 'string',
    description: 'Define the VLC http server password',
    default: process.moonConfig.vlc.password
  })
  .parseSync();

export default argv;
