import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: process.env.route_frontend,
    credentials: true,
  },
})
export class ChatGateway {
  constructor(private chatService: ChatService) {}
  @WebSocketServer()
  server;

  clients = [];

  async handleConnection(client: Socket) {
    if (client?.handshake?.headers?.cookie) {
      const user = await this.chatService.getuserbysocket(
        client.handshake.headers.cookie,
      );
      if (!user) return;
      //push to clients user with his client
      this.clients.push({ userid: user.id, client: client });
      const rooms = await this.chatService.get_my_rooms(user.id);
      if (rooms) {
        rooms.forEach((room) => {
          client.join(room.id);
        });
      }
    }
  }

  async handleDisconnect(client: Socket) {
    if (client?.handshake?.headers?.cookie) {
      const user = await this.chatService.getuserbysocket(
        client.handshake.headers.cookie,
      );
      if (!user) return;

      //remove from clients user with his client
      this.clients = this.clients.filter((client) => client.userid !== user.id);

      const rooms = await this.chatService.get_my_rooms(user.id);
      if (rooms) {
        rooms.forEach((room) => {
          client.leave(room.id);
        });
      }
    }
  }

  @SubscribeMessage('chatToServer')
  async handleMessage(client: Socket, message: any) {
    if (client?.handshake?.headers?.cookie) {
      const user = await this.chatService.getuserbysocket(
        client.handshake.headers.cookie,
      );
      if (
        (await this.chatService.check_is_banned(message.roomId, user.id)) ||
        (await this.chatService.check_is_muted(message.roomId, user.id))
      ) {
        this.server.to(client.id).emit("You can't send this message!");
        return;
      }
      const msg = await this.chatService.push_message(
        message.roomId,
        user.id,
        message.message,
      );
      const blockedUsers = await this.chatService.get_blockedUsers(
        message.roomId,
        user.id,
      );
      //get banned users
      const bannedUsers = await this.chatService.get_bannedUsers(
        message.roomId,
      );
      const ret = {
        roomId: message?.roomId,
        id: msg?.id,
        username: user?.login,
        avatar: user?.avatarUrl,
        message: message?.message,
        time: message?.date,
        blockedUsers: blockedUsers,
        bannedUsers: bannedUsers,
        isRoom: await this.chatService.check_is_channel(message.roomId),
      };
      await this.chatService.update_all_unreadMessages(
        message.roomId,
        user.id,
        true,
      );
      await this.chatService.set_last_msg(
        message.roomId,
        message.message,
        user.id,
      );
      this.server.to(message.roomId).emit('chatToClient', ret);
    }
  }
}
