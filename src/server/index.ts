import express from 'express';
import * as http from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'node:url';
import os from 'os';
import fs from 'fs';
import { VLCController } from './player';

const vlc = new VLCController({ httpPassword: 'moon', httpPort: 45002 });
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

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

let statusInterval: NodeJS.Timeout | null = null;
let availableAudioTracks: any[] = [];
let availableSubtitleTracks: any[] = [];
let currentAudioTrack: number = -1;
let currentSubtitleTrack: number = -1;

function startStatusUpdates(socket: any) {
  if (statusInterval) {
    clearInterval(statusInterval);
  }

  statusInterval = setInterval(async () => {
    if (vlc.isOpen()) {
      try {
        const status = await vlc.getStatus();
        const statusWithTitle = {
          ...status,
          title: vlc.getTitle(),
          currentAudioTrack,
          currentSubtitleTrack,
          availableAudioTracks,
          availableSubtitleTracks
        };
        socket.emit('player-status', statusWithTitle);
        // Broadcast to all connected clients
        io.emit('player-status', statusWithTitle);
      } catch (error) {
        console.error('Error getting VLC status:', error);
      }
    }
  }, 1000); // Update every second
}

function stopStatusUpdates() {
  if (statusInterval) {
    clearInterval(statusInterval);
    statusInterval = null;
  }
}

io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id);

  if (vlc.isOpen()) {
    const status = await vlc.getStatus();
    const statusWithTracks = {
      ...status,
      title: vlc.getTitle(),
      currentAudioTrack,
      currentSubtitleTrack,
      availableAudioTracks,
      availableSubtitleTracks
    };
    socket.emit('player-opened', statusWithTracks);
    startStatusUpdates(socket);
  }

  socket.on('watch', async (data) => {
    const { uri, title, audioTracks, subtitleTracks } = data;

    console.log('Watch request for:', uri);
    console.log('Available audio tracks:', audioTracks?.length || 0);
    console.log('Available subtitle tracks:', subtitleTracks?.length || 0);

    if (fs.existsSync(uri) && !vlc.isOpen()) {
      try {
        // Store track information
        availableAudioTracks = audioTracks || [];
        availableSubtitleTracks = subtitleTracks || [];

        // Reset current track selections to defaults
        currentAudioTrack = -1; // Default
        currentSubtitleTrack = -1; // Off

        // Find default tracks if available
        const defaultAudio = availableAudioTracks.find((track) => track.default || track.selected);
        const defaultSubtitle = availableSubtitleTracks.find((track) => track.default || track.selected);

        if (defaultAudio) {
          currentAudioTrack = availableAudioTracks.indexOf(defaultAudio);
        }
        if (defaultSubtitle) {
          currentSubtitleTrack = availableSubtitleTracks.indexOf(defaultSubtitle);
        }

        await vlc.openFile(uri, title);
        await vlc.waitForPlayback();

        const status = await vlc.getStatus();
        const statusWithTracks = {
          ...status,
          title: vlc.getTitle(),
          currentAudioTrack,
          currentSubtitleTrack,
          availableAudioTracks,
          availableSubtitleTracks
        };

        socket.emit('watch', true);
        socket.emit('player-opened', statusWithTracks);
        io.emit('player-opened', statusWithTracks); // Broadcast to all clients

        startStatusUpdates(socket);
      } catch (error) {
        console.error('Error opening file:', error);
        socket.emit('watch', false);
      }
    } else if (vlc.isOpen()) {
      // VLC is already open, try to add to playlist or replace
      try {
        // Store track information
        availableAudioTracks = audioTracks || [];
        availableSubtitleTracks = subtitleTracks || [];

        // Reset current track selections to defaults
        currentAudioTrack = -1; // Default
        currentSubtitleTrack = -1; // Off

        // Find default tracks if available
        const defaultAudio = availableAudioTracks.find((track) => track.default || track.selected);
        const defaultSubtitle = availableSubtitleTracks.find((track) => track.default || track.selected);

        if (defaultAudio) {
          currentAudioTrack = availableAudioTracks.indexOf(defaultAudio);
        }
        if (defaultSubtitle) {
          currentSubtitleTrack = availableSubtitleTracks.indexOf(defaultSubtitle);
        }

        await vlc.close();
        await vlc.openFile(uri, title);
        await vlc.waitForPlayback();

        const status = await vlc.getStatus();
        const statusWithTracks = {
          ...status,
          title: vlc.getTitle(),
          currentAudioTrack,
          currentSubtitleTrack,
          availableAudioTracks,
          availableSubtitleTracks
        };

        socket.emit('watch', true);
        socket.emit('player-opened', statusWithTracks);
        io.emit('player-opened', statusWithTracks); // Broadcast to all clients

        startStatusUpdates(socket);
      } catch (error) {
        console.error('Error replacing file:', error);
        socket.emit('watch', false);
      }
    } else {
      console.log('File does not exist:', uri);
      socket.emit('watch', false);
    }
  });

  socket.on('toggle-play-pause', async () => {
    if (vlc.isOpen()) {
      try {
        await vlc.togglePlayPause();
        socket.emit('toggle-play-pause', true);
      } catch (error) {
        socket.emit('toggle-play-pause', false);
      }
    } else {
      socket.emit('toggle-play-pause', false);
    }
  });

  socket.on('play', async () => {
    if (vlc.isOpen()) {
      try {
        await vlc.play();
        socket.emit('play', true);
      } catch (error) {
        socket.emit('play', false);
      }
    } else {
      socket.emit('play', false);
    }
  });

  socket.on('pause', async () => {
    if (vlc.isOpen()) {
      try {
        await vlc.pause();
        socket.emit('pause', true);
      } catch (error) {
        socket.emit('pause', false);
      }
    } else {
      socket.emit('pause', false);
    }
  });

  socket.on('volume', async (volume) => {
    if (vlc.isOpen()) {
      try {
        await vlc.setVolumePercent(volume);
        socket.emit('volume', true);
      } catch (error) {
        socket.emit('volume', false);
      }
    } else {
      socket.emit('volume', false);
    }
  });

  socket.on('audio-track', async (track) => {
    if (vlc.isOpen()) {
      try {
        await vlc.setAudioTrack(track);
        currentAudioTrack = track; // Update current audio track
        socket.emit('audio-track', true);
      } catch (error) {
        socket.emit('audio-track', false);
      }
    } else {
      socket.emit('audio-track', false);
    }
  });

  socket.on('subtitle-track', async (track) => {
    if (vlc.isOpen()) {
      try {
        await vlc.setSubtitleTrack(track);
        currentSubtitleTrack = track; // Update current subtitle track
        socket.emit('subtitle-track', true);
      } catch (error) {
        socket.emit('subtitle-track', false);
      }
    } else {
      socket.emit('subtitle-track', false);
    }
  });

  socket.on('close', async () => {
    if (vlc.isOpen()) {
      try {
        stopStatusUpdates();
        await vlc.close();
        socket.emit('close', true);
        io.emit('player-closed');
      } catch (error) {
        socket.emit('close', false);
      }
    } else {
      socket.emit('close', false);
    }
  });

  socket.on('seek', async (time) => {
    if (vlc.isOpen()) {
      try {
        await vlc.seek(time);
        socket.emit('seek', true);
      } catch (error) {
        socket.emit('seek', false);
      }
    } else {
      socket.emit('seek', false);
    }
  });

  socket.on('seek-relative', async (time) => {
    if (vlc.isOpen()) {
      try {
        await vlc.seekRelative(time);
        socket.emit('seek-relative', true);
      } catch (error) {
        socket.emit('seek-relative', false);
      }
    } else {
      socket.emit('seek-relative', false);
    }
  });

  socket.on('seek-percent', async (percent) => {
    if (vlc.isOpen()) {
      try {
        await vlc.seekToPercent(percent);
        socket.emit('seek-percent', true);
      } catch (error) {
        socket.emit('seek-percent', false);
      }
    } else {
      socket.emit('seek-percent', false);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    stopStatusUpdates();
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
    const address = server.address();
    const port = typeof address === 'string' ? PORT : address?.port || PORT;

    const networkInterfaces = os.networkInterfaces();
    let lanIP = 'localhost';
    let fallbackIP = '';

    const isPrivateNetwork = (ip: string): boolean => {
      const parts = ip.split('.').map(Number);
      if (parts[0] === 192 && parts[1] === 168) return true;
      if (parts[0] === 10) return true;
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
      return false;
    };

    const isAPIPA = (ip: string): boolean => {
      const parts = ip.split('.').map(Number);
      return parts[0] === 169 && parts[1] === 254;
    };

    for (const interfaceName in networkInterfaces) {
      const interfaces = networkInterfaces[interfaceName];
      if (interfaces) {
        for (const iface of interfaces) {
          if (iface.family === 'IPv4' && !iface.internal) {
            if (isPrivateNetwork(iface.address)) {
              lanIP = iface.address;
              break;
            } else if (!isAPIPA(iface.address) && !fallbackIP) {
              fallbackIP = iface.address;
            } else if (isAPIPA(iface.address) && !fallbackIP) {
              fallbackIP = iface.address;
            }
          }
        }
        if (lanIP !== 'localhost') break;
      }
    }

    if (lanIP === 'localhost' && fallbackIP) {
      lanIP = fallbackIP;
    }

    console.log(`Server running on:`);
    console.log(`  Local:   http://localhost:${port}`);
    console.log(`  Network: http://${lanIP}:${port}`);
  });
};
