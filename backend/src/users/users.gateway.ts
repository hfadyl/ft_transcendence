import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from './users.service';
import { activeUser, Notification } from './utils/type';
import { User } from '.prisma/client';

@Injectable()
@WebSocketGateway({
  namespace: '/status',
  cors: {
    origin: process.env.route_frontend,
    credentials: true,
  },
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private userservice: UsersService) {}

  @WebSocketServer() server: Server;

  //array of avtice users
  activeUsers: activeUser[] = [];

  async handleDisconnect(client: Socket) {
    if (client.handshake.headers.cookie) {
      const user = await this.userservice.getuserbysocket(
        client.handshake.headers.cookie,
      );
      if (user) {
        this.activeUsers = this.activeUsers.filter(
          (activeUser) => activeUser.id !== user.id,
        );
      }
    }

    this.server.emit(
      'activeUsers',
      this.activeUsers.map((activeUser) => {
        return {
          login: activeUser.login,
          inGame: activeUser.inGame,
        };
      }),
    );
  }

  async change_login(login: string, new_login: string) {
    const user = this.activeUsers.find(
      (activeUser) => activeUser.login === login,
    );
    if (user) user.login = new_login;
    this.server.emit(
      'activeUsers',
      this.activeUsers.map((activeUser) => {
        return {
          login: activeUser.login,
          inGame: activeUser.inGame,
        };
      }),
    );
  }

  async handleConnection(client: Socket) {
    if (client.handshake.headers.cookie) {
      const user = await this.userservice.getuserbysocket(
        client.handshake.headers.cookie,
      );
      if (user) {
        const userInArray = this.activeUsers.find(
          (activeUser) => activeUser.id === user.id,
        );
        if (!userInArray) {
          this.activeUsers.push({
            login: user.login,
            inGame: false,
            id: user.id,
            socket: client,
          });
        }
      }
    }
    this.server.emit(
      'activeUsers',
      this.activeUsers.map((activeUser) => {
        return {
          login: activeUser.login,
          inGame: activeUser.inGame,
        };
      }),
    );
  }

  async changeStatus(login: string, inGame: boolean) {
    const user = this.activeUsers.find(
      (activeUser) => activeUser.login === login,
    );
    if (user) user.inGame = inGame;
    this.server.emit(
      'activeUsers',
      this.activeUsers.map((activeUser) => {
        return {
          login: activeUser.login,
          inGame: activeUser.inGame,
        };
      }),
    );
  }

  async getStatus(username: string) {
    const user = this.activeUsers.find(
      (activeUser) => activeUser.login === username,
    );
    if (user) {
      if (user.inGame) return 'inGame';
      else return 'online';
    }
    return 'offline';
  }

  async sendNotification(notification: Notification) {
    const user = this.activeUsers.find(
      (activeUser) => activeUser.login === notification.reciver,
    );
    if (user) user.socket.emit('notification', notification);
  }
}
