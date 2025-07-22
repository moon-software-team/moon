import express from 'express';
import * as http from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'node:url';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  serveClient: true,
  path: '/socket.io/'
});

const PORT = process.env.PORT || 45001;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

export const startServer = (entry: string): void => {
  let entryPath = entry;
  if (entry.startsWith('file://')) {
    entryPath = fileURLToPath(entry);
  }

  const publicPath = path.join(entryPath, 'public');

  app.use(express.static(publicPath));

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
