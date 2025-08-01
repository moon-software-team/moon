/** Dependencies */
import { Server as SocketIOServer } from 'socket.io';
import { DefaultSocket } from '@server/types';
import fs from 'fs';

let statusInterval: NodeJS.Timeout | null = null;

const stopStatusUpdates = () => {
  if (statusInterval) {
    clearInterval(statusInterval);
    statusInterval = null;
  }
};

const startStatusUpdates = (io: SocketIOServer) => {
  if (statusInterval) {
    clearInterval(statusInterval);
  }

  statusInterval = setInterval(async () => {
    if (process.moon.status === 'playing' && process.moon.player.isOpen()) {
      try {
        const status = await process.moon.player.getStatus();
        // Broadcast to all connected clients
        io.emit('player-status', status);
      } catch (error) {
        console.error('Error getting process.moon.player status:', error);
      }
    }
  }, 1000); // Update every second
};

export const onPlayerOpened = async (io: SocketIOServer, socket: DefaultSocket) => {
  if (process.moon.status === 'playing' && process.moon.player.isOpen()) {
    const status = await process.moon.player.getStatus();
    socket.emit('player-opened', status);
    startStatusUpdates(io);
  }
};

export const onStop = async (io: SocketIOServer, socket: DefaultSocket) => {
  if (process.moon.status === 'playing' && process.moon.player.isOpen()) {
    try {
      stopStatusUpdates();
      socket.emit('stop', true);
      io.emit('player-closed');
      await process.moon.player.close();
      process.moon.status = 'ambient';
      await process.moon.server.startAmbientMusic();
    } catch (error) {
      socket.emit('stop', false);
    }
  } else {
    socket.emit('stop', false);
  }
};

export const onWatch = async (io: SocketIOServer, socket: DefaultSocket, data: any) => {
  const { uri } = data;

  if (fs.existsSync(uri)) {
    try {
      if (process.moon.player.isOpen()) {
        // If process.moon.player is already open, close it first
        await process.moon.player.close();
      }

      process.moon.status = 'playing';

      await process.moon.player.open(uri, [
        '--fullscreen',
        '--no-video-title-show',
        '--no-osd',
        '--no-random',
        '--no-loop',
        '--no-repeat',
        '--video-on-top',
        '--no-embedded-video',
        '--qt-minimal-view',
        '--qt-notification=0',
        '--extraintf=dummy'
      ]);

      console.log(`Opened file: ${uri}`);
      await process.moon.player.setVolume(256);
      await process.moon.player.seek('50%');

      setTimeout(() => {
        onStop(io, socket);
      }, 10e3);

      const status = await process.moon.player.getStatus();

      socket.emit('watch', true);
      io.emit('player-opened', status);

      startStatusUpdates(io);
    } catch (error) {
      console.error('Error opening file:', error);
      socket.emit('watch', false);
      process.moon.status = 'ambient';
      await process.moon.server.startAmbientMusic();
    }
  } else {
    console.log('File does not exist:', uri);
    socket.emit('watch', false);
  }
};

export const onChangeSubtitleTrack = async (socket: DefaultSocket, trackId: number) => {
  if (process.moon.status === 'playing' && process.moon.player.isOpen()) {
    try {
      await process.moon.player.selectSubtitleTrack(trackId);
      socket.emit('subtitle-track', true);
    } catch (error) {
      socket.emit('subtitle-track', false);
    }
  } else {
    socket.emit('subtitle-track', false);
  }
};

/**
 * @brief Changes the audio track of the currently playing media.
 * @param socket The socket connection to emit the result.
 * @param trackId The ID of the audio track to select.
 * @description This function checks if the player is currently playing media and is open.
 * If so, it attempts to change the audio track to the specified ID. If successful,
 * it emits a success message; otherwise, it emits a failure message.
 * If the player is not playing or not open, it emits a failure message.
 */
export const onChangeAudioTrack = async (socket: DefaultSocket, trackId: number) => {
  if (process.moon.status === 'playing' && process.moon.player.isOpen()) {
    try {
      await process.moon.player.selectAudioTrack(trackId);
      socket.emit('audio-track', true);
    } catch (error) {
      socket.emit('audio-track', false);
    }
  } else {
    socket.emit('audio-track', false);
  }
};
