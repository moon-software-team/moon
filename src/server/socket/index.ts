import { Server as SocketIOServer } from 'socket.io';
import { DefaultSocket } from '../../types';
import {
  onPlay,
  onPause,
  onTogglePlayPause,
  onStop,
  onVolume,
  onSeek,
  onSeekRelative,
  onSeekPercent,
  onWatch,
  onChangeAudioTrack,
  onChangeSubtitleTrack
} from './player';

export const onDisconnect = (socket: DefaultSocket) => {
  // Handle socket disconnection logic here
};

export const onConnection = async (io: SocketIOServer, socket: DefaultSocket) => {
  // Disconnection event
  socket.on('disconnect', () => onDisconnect(socket));

  // Player control events
  socket.on('play', () => onPlay(socket));
  socket.on('pause', () => onPause(socket));
  socket.on('toggle-play-pause', () => onTogglePlayPause(socket));
  socket.on('stop', () => onStop(io, socket));
  socket.on('volume', (volume: number) => onVolume(socket, volume));
  socket.on('seek', (time: number) => onSeek(socket, time));
  socket.on('seek-relative', (time: number) => onSeekRelative(socket, time));
  socket.on('seek-percent', (percent: number) => onSeekPercent(socket, percent));

  // Media control events
  socket.on('watch', () => onWatch(socket));
  socket.on('change-audio-track', (trackId: number) => onChangeAudioTrack(socket, trackId));
  socket.on('change-subtitle-track', (trackId: number) => onChangeSubtitleTrack(socket, trackId));
};

export type { DefaultSocket };
