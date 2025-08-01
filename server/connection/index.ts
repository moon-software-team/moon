/** Dependencies */
import { Server as SocketIOServer } from 'socket.io';
import { DefaultSocket } from '@server/types';
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

/**
 * @brief Handles socket disconnection events.
 * @param socket - The socket that has disconnected.
 * @description This function is called when a socket disconnects.
 * It can be used to clean up resources or perform any necessary actions when a user disconnects.
 */
export const onDisconnect = (socket: DefaultSocket) => {
  // Handle socket disconnection logic here
};

/**
 * @brief Handles a new socket connection.
 * @param io - The Socket.IO server instance.
 * @param socket - The newly connected socket.
 * @description This function is called when a new socket connection is established.
 * It sets up event listeners for various player control events and media control events.
 * It also checks if the player is already opened and sends the current status if it is.
 */
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

/** Exports the DefaultSocket type */
export type { DefaultSocket };
