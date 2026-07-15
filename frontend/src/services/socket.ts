import { io, Socket } from 'socket.io-client';
import { API_ORIGIN } from '../config/env';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;

  socket = io(API_ORIGIN, {
    auth: { token: localStorage.getItem('token') },
    withCredentials: true,
    autoConnect: true,
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/** Call after a token refresh so the next reconnect authenticates with the new token. */
export function refreshSocketAuth() {
  if (!socket) return;
  socket.auth = { token: localStorage.getItem('token') };
  if (socket.connected) {
    socket.disconnect().connect();
  }
}
