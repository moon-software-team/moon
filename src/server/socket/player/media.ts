import { Server as SocketIOServer } from 'socket.io';
import { DefaultSocket } from '../../../types';
import { vlc } from '../../services';
import fs from 'fs';

let statusInterval: NodeJS.Timeout | null = null;
let availableAudioTracks: any[] = [];
let availableSubtitleTracks: any[] = [];
let currentAudioTrack: number = -1;
let currentSubtitleTrack: number = -1;

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
        // Broadcast to all connected clients
        io.emit('player-status', statusWithTitle);
      } catch (error) {
        console.error('Error getting VLC status:', error);
      }
    }
  }, 1000); // Update every second
};

export const onPlayerOpened = async (io: SocketIOServer, socket: DefaultSocket) => {
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
    startStatusUpdates(io);
  }
};

export const onStop = async (io: SocketIOServer, socket: DefaultSocket) => {
  if (vlc.isOpen()) {
    try {
      stopStatusUpdates();
      await vlc.close();
      socket.emit('stop', true);
      io.emit('player-closed');
    } catch (error) {
      socket.emit('stop', false);
    }
  } else {
    socket.emit('stop', false);
  }
};

export const onWatch = async (io: SocketIOServer, socket: DefaultSocket, data: any) => {
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

      startStatusUpdates(io);
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

      startStatusUpdates(io);
    } catch (error) {
      console.error('Error replacing file:', error);
      socket.emit('watch', false);
    }
  } else {
    console.log('File does not exist:', uri);
    socket.emit('watch', false);
  }
};

export const onChangeSubtitleTrack = async (socket: DefaultSocket, trackId: number) => {
  if (vlc.isOpen()) {
    try {
      await vlc.setSubtitleTrack(trackId);
      currentSubtitleTrack = trackId;
      socket.emit('subtitle-track', true);
    } catch (error) {
      socket.emit('subtitle-track', false);
    }
  } else {
    socket.emit('subtitle-track', false);
  }
};

export const onChangeAudioTrack = async (socket: DefaultSocket, trackId: number) => {
  if (vlc.isOpen()) {
    try {
      await vlc.setAudioTrack(trackId);
      currentAudioTrack = trackId;
      socket.emit('audio-track', true);
    } catch (error) {
      socket.emit('audio-track', false);
    }
  } else {
    socket.emit('audio-track', false);
  }
};
