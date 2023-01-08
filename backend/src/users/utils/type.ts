import { Socket } from 'socket.io';
export interface activeUser {
  id: string;
  login: string;
  inGame: Boolean;
  socket: Socket;
}

export interface Notification {
  type: 'request' | 'message' | 'game';
  reciver: string;
  reciverId: string;
  sender: string;
  senderId: string;
  message: string;
  image: string;
  createdAt: Date;
  seen: Boolean;
  id?: string;
}
