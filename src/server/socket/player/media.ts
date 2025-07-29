import { Server as SocketIOServer } from 'socket.io';
import { DefaultSocket } from '../../../types';
import { vlc } from '../../../utils';
import { AudioTrack, SubtitleTrack, VideoTrack } from '../../../types';
import fs from 'fs';

let statusInterval: NodeJS.Timeout | null = null;
let availableAudioTracks: AudioTrack[] = [];
let availableSubtitleTracks: SubtitleTrack[] = [];
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
          title: await vlc.getTitle(),
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
  const { uri } = data;

  if (fs.existsSync(uri) && !vlc.isOpen()) {
    try {
      await vlc.open(
        [
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
        ],
        uri
      );

      availableAudioTracks = await vlc.getAudioTracks();
      availableSubtitleTracks = await vlc.getSubtitleTracks();

      currentAudioTrack = availableAudioTracks.find((track) => track.selected).id;
      currentSubtitleTrack = availableSubtitleTracks.find((track) => track.selected).id;

      const status = await vlc.getStatus();
      const statusWithTracks = {
        ...status,
        title: await vlc.getTitle(),
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
      await vlc.close();
      await vlc.open(
        [
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
        ],
        uri
      );

      availableAudioTracks = await vlc.getAudioTracks();
      availableSubtitleTracks = await vlc.getSubtitleTracks();

      currentAudioTrack = availableAudioTracks.find((track) => track.selected).id;
      currentSubtitleTrack = availableSubtitleTracks.find((track) => track.selected).id;

      const status = await vlc.getStatus();
      const statusWithTracks = {
        ...status,
        title: await vlc.getTitle(),
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
