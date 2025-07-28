import { Socket, DefaultEventsMap } from 'socket.io';

export type DefaultSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
