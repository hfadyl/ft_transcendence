import { GameService } from './game.service';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsClass } from './data/rooms';
import { Room } from './data/board';
import { UserGateway } from 'src/users/users.gateway';
import { forwardRef, Inject } from '@nestjs/common';

let users: {
  username: string;
  id: string;
}[] = [];

let usersInGame: {
  username: string;
  id: string;
}[] = [];

let maxscore = 5;

let rooms: Room[] = [];
const roomsClass = new RoomsClass();

@WebSocketGateway({
  namespace: 'game',
  cors: true,
  origin: [process.env.route_frontend],
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private usergateway: UserGateway,
    //forward declaration
    @Inject(forwardRef(() => GameService))
    private gameservice: GameService,
  ) {}
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]): any {}

  async handleDisconnect(client: Socket, ...args: any[]): Promise<any> {
    this.disconnectLogic(client);
  }

  @SubscribeMessage('joinRoom_F')
  async handleJoinRoom(client: Socket, data: any): Promise<void> {
    const [user, roomToJoinId, requestType] = data;
    if (requestType == 'toWatch') {
      this.joinToWatch(client, roomToJoinId, user);
    } else {
      let userInGame = usersInGame.find((u) => u.username == user.username);
      if (userInGame) {
        this.server.to(client.id).emit('alreadyInGame');
        return;
      }
      let roomToJoin = rooms.find((r) => r.id == roomToJoinId);
      if (requestType == 'invited') {
        this.addSecondPlayer(client, user, roomToJoin);
      } else if (requestType == 'toInvite') {
        let reservedRoom = roomsClass.createRoom(rooms, true);
        this.addFirstPlayer(client, user, reservedRoom);
      } else {
        this.joinQueue(client, user);
      }
    }
  }

  @SubscribeMessage('mouseMove_F')
  handleMouseMove(client: Socket, data: any): void {
    const [mouseY, user] = data;

    const wichRoom = roomsClass.inWhichRoom(rooms, user.username);
    const room = rooms.find((r) => r.id == wichRoom);
    let player =
      room?.players[0].username == user.username ? 'first' : 'second';

    if (player == 'first') room.board.player1_y = mouseY;
    else {
      if (room?.players.length == 2) {
        room.board.player2_y = mouseY;
      }
    }

    if (mouseY > 0 && mouseY < room?.board.height - room?.board.paddleHeight) {
      this.server.to(room?.id).emit('mouseMove_B', mouseY, player);
    }
  }

  @SubscribeMessage('getLiveGames_F')
  handleGetLiveGames(client: Socket, username: string): void {
    let liveRooms = roomsClass.getLiveRooms(rooms);
    this.server.emit('liveGames', liveRooms);
    users.push({
      id: client.id,
      username,
    });
  }

  @SubscribeMessage('unmount')
  handleUnmount(client: Socket, user: any): void {
    this.disconnectLogic(client);
  }

  @SubscribeMessage('inviteToPlay')
  async handleInvitation(
    client: Socket,
    reciverUsername: string,
  ): Promise<void> {
    const receiver = users.find((u) => u.username == reciverUsername);
    const sender = users.find((u) => u.id == client.id);

    if (sender) {
      const senderUser = await this.gameservice.get_User_by_username(
        sender?.username,
      );
      client.to(receiver?.id).emit('invitation', {
        ...senderUser,
        message: `${sender.username} wants to play with you`,
      });
    }
  }

  @SubscribeMessage('acceptPlayRequest')
  handleAcceptPlayRequest(client: Socket, sender: string): void {
    const wichRoom = roomsClass.inWhichRoom(rooms, sender);
    const room = rooms.find((r) => r.id == wichRoom);
    if (wichRoom) {
      client.emit('getInvitationRoomId', wichRoom, room.reserved);
    }
  }

  joinQueue(client: Socket, user: any): void {
    let availableRoom = roomsClass.getAvailableRoom(rooms);
    if (availableRoom == null) {
      availableRoom = roomsClass.createRoom(rooms);
      this.addFirstPlayer(client, user, availableRoom);
    } else {
      this.addSecondPlayer(client, user, availableRoom);
      let liveRooms = roomsClass.getLiveRooms(rooms);
      this.server.emit('liveGames', liveRooms);
    }
  }

  async addFirstPlayer(client: Socket, user: any, room: any): Promise<void> {
    this.usergateway.changeStatus(user.username, true);
    usersInGame.push({
      id: client.id,
      username: user.username,
    });
    roomsClass.addPlayer(room, user, client.id, 'first');
    client.join(room.id);
  }

  async addSecondPlayer(client: Socket, user: any, room: any): Promise<void> {
    usersInGame.push({
      id: client.id,
      username: user.username,
    });
    this.usergateway.changeStatus(user.username, true);
    roomsClass.addPlayer(room, user, client.id, 'second');
    roomsClass.initBoard(room);
    client.join(room.id);
    this.server.to(room.id).emit('availableRoom', room.id);
    setTimeout(() => {
      this.server.to(room.id).emit('startGame_B', room.players[1]);
    }, 3000);
    setTimeout(() => {
      room.board.gameOn = true;
      this.moveBall(client, room);
    }, 3000);
  }

  joinToWatch(client: Socket, liveRoomId: any, user: any): void {
    const liveRoom = rooms.find((r) => r.id == liveRoomId);
    if (liveRoom) {
      const player = roomsClass.getPlayer(liveRoom, user.username);
      const newViewer = roomsClass.getViewer(liveRoom, user.username);
      if (player || newViewer) {
        client.emit('alreadyInRoom');
        return;
      }
      roomsClass.addViewerToRoom(liveRoom, user, client.id);
      this.server.to(liveRoomId).emit('updateViewsNb', liveRoom.board.views);
      client.join(liveRoom.id);
      const viewer = roomsClass.getViewer(liveRoom, user.username);
      viewer.viewerInterval = setInterval(() => {
        client.emit(
          'boardData_B',
          liveRoom.board,
          liveRoom.players[0],
          liveRoom.players[1],
        );
      }, 1000 / 60);
    } else {
      client.emit('roomNotFound');
    }
  }

  // !! ********************************* moveball logic   ***********************************

  moveBall(client: Socket, room: Room): void {
    room.interval = setInterval(() => {
      const { top, left, right, bottom } = roomsClass.getLimits(room);
      const [next_x, next_y] = roomsClass.getNextCoordinates(room);

      if (next_x < left || next_x > right) {
        let player = next_x < left ? 'first' : 'second';
        if (!roomsClass.hitPaddle(room, player)) {
          roomsClass.initBall(room);

          roomsClass.updateScores(room, player);
          if (player == 'first') {
            if (room.board.rightScore == maxscore) {
              this.gameOver(client, room, true);
            }
          } else {
            if (room.board.leftScore == maxscore) {
              this.gameOver(client, room, true);
            }
          }

          this.server
            .to(room.id)
            .emit(
              'updateScore',
              room.board.leftScore,
              room.board.rightScore,
              room.board.player1points,
              room.board.player2points,
            );
        } else {
          room.board.ballSpeed_x = -room.board.ballSpeed_x;
        }
      }

      if (next_y < top || next_y > bottom)
        room.board.ballSpeed_y = -room.board.ballSpeed_y;

      room.board.ball_x += room.board.ballSpeed_x;
      room.board.ball_y += room.board.ballSpeed_y;

      this.server
        .to(room.id)
        .emit('moveBall_B', room.board.ball_x, room.board.ball_y, room.board);
    }, 1000 / 60);
  }

  @SubscribeMessage('requestBoardData')
  handleRequestBoardData(client: Socket, id: string): void {
    const room = rooms.find((r) => r.id === id);
    if (room) {
      this.server
        .to(room.id)
        .emit('boardData_B', room.board, room.players[0], room.players[1]);
    }
  }

  @SubscribeMessage('getUsersInGame')
  handleGetUsersInGame(client: Socket): void {
    this.server.emit('usersInGame_B', usersInGame);
  }

  async disconnectLogic(client: Socket): Promise<void> {
    const wichRoom = roomsClass.inWhichRoomBySocket(rooms, client.id);
    let room = rooms.find((r) => r.id == wichRoom);
    let player = room?.players.find((p) => p.socketId == client.id);

    if (player) {
      await this.usergateway.changeStatus(player?.username, false);

      usersInGame = usersInGame.filter((u) => u.username != player?.username);
      client.emit('youLeftTheRoomAndLost');
      let otherPlayer = room?.players.find((p) => p.socketId != client.id);
      if (otherPlayer) {
        await this.usergateway.changeStatus(otherPlayer?.username, false);

        usersInGame = usersInGame.filter(
          (u) => u.username != otherPlayer?.username,
        );
      }
      room.interval = clearInterval(room?.interval);
      this.server.to(room?.id).emit('roomRemoved', room?.id);
      client.leave(room?.id);
      if (room?.viewers.length >= 1) {
        room.viewers.forEach((viewer) => {
          viewer.viewerInterval = clearInterval(viewer.viewerInterval);
          client.leave(room?.id);
        });
      }
      if (room?.board?.gameOn) this.gameOver(client, room, false);
      rooms = roomsClass.removeRoom(rooms, wichRoom);
    } else {
      let viewer = room?.viewers.find((w) => w.socketId == client.id);
      if (viewer) {
        viewer.viewerInterval = clearInterval(viewer.viewerInterval);
        room = roomsClass.removeViewerFromRoom(room, viewer);
        client.leave(room?.id);
        this.server.to(room?.id).emit('updateViewsNb', room?.board.views);
      }
    }

    let liveRooms = roomsClass.getLiveRooms(rooms);
    if (liveRooms?.length >= 1) this.server.emit('liveGames', liveRooms);

    users = users.filter((u) => u.id != client.id); // remove other player in room check
  }

  gameOver(client: Socket, room: Room, reachMaxScore: boolean): void {
    let winnerType = null;
    let winner = null;
    let loser = null;
    room.board.gameOn = false;
    let gameEndType = null;
    if (!reachMaxScore) {
      loser = room.players.find((p) => p.socketId == client.id);
      winner = room.players.find((p) => p.socketId != client.id);
      winner.score = 5;
      loser.score = 0;
      winnerType = winner?.playerType;
      client.emit('gameEnds', 'lost');
      this.server.to(winner?.socketId).emit('gameEnds', 'won');
      gameEndType = 'aPlayerLeft';
    } else {
      winnerType =
        room.board.leftScore > room.board.rightScore ? 'first' : 'second';
      winner = room.players.find((p) => p.playerType == winnerType);
      loser = room.players.find((p) => p.playerType != winnerType);
      gameEndType = 'maxScoreReached';
    }

    this.server
      .to(room.id)
      .emit('gameOver_B', room.players[0], room.players[1]);

    this.gameservice.push_game_to_db(
      winner?.username,
      loser?.username,
      winner.score,
      loser.score,
      room?.maxViews,
    );

    let liveRooms = roomsClass
      .getLiveRooms(rooms)
      .filter((r) => r.id != room.id);
    this.server.emit('liveGames', liveRooms);

    room.interval = clearInterval(room.interval);
  }

  async emitAchievements(achievementNumber: number, username: string) {
    const socketId = users?.find((u) => u.username == username)?.id;
    this.server.to(socketId).emit('achievement', achievementNumber);
  }
}
