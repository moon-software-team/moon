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
  onChangeSubtitleTrack,
  onPlayerOpened as onPlayerAlreadyOpened
} from './player';

export const onDisconnect = (socket: DefaultSocket) => {
  // Handle socket disconnection logic here
};

export const onConnection = async (io: SocketIOServer, socket: DefaultSocket) => {
  // Disconnection event
  socket.on('disconnect', () => onDisconnect(socket));

  // If VLC is open, send the current status
  await onPlayerAlreadyOpened(io, socket);

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
  socket.on('watch', (data) => onWatch(io, socket, data));
  socket.on('audio-track', (trackId: number) => onChangeAudioTrack(socket, trackId));
  socket.on('subtitle-track', (trackId: number) => onChangeSubtitleTrack(socket, trackId));
};

export type { DefaultSocket };
