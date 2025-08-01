/** Dependencies */
import { Socket, DefaultEventsMap } from 'socket.io';

/**
 * @brief Default socket type for the application.
 * @description This type extends the Socket type from socket.io to include custom events.
 */
export type DefaultSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
