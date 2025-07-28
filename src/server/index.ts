import express from 'express';
import * as http from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { onConnection } from './socket';
import { getLanIPAddress } from './utils';
import { plex } from './services';
import QRCode from 'qrcode';
import argv from '../config';
import mainRouter from './routes';

const app = express();
const server = http.createServer(app);

app.use('/', mainRouter);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  serveClient: true,
  path: '/socket.io/'
});
io.on('connection', onConnection);

export const startServer = (entry: string): void => {
  plex.init();

  let entryPath = entry;
  if (entry.startsWith('file://')) {
    entryPath = fileURLToPath(entry);
  }

  const publicPath = path.join(entryPath, 'public');

  app.use(express.static(publicPath));

  const PORT = argv['port'] || 45001;

  server.listen(PORT, () => {
    const address = server.address();
    const port = typeof address === 'string' ? PORT : address?.port || PORT;

    console.log(`Server running on:`);
    console.log(`  Local:   http://localhost:${port}`);
    console.log(`  Network: http://${getLanIPAddress()}:${port}`);

    QRCode.toString(`http://${getLanIPAddress()}:${port}`, { type: 'terminal', small: true }, (err, url) => {
      console.log(`  QR Code: \n${url}`);
    });
  });
};
