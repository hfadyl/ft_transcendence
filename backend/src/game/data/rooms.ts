import { GameService } from './../game.service';
import { v4 as uuida } from 'uuid';
import { Room, Player, Viewer } from './board';

export class RoomsClass {
  getAvailableRoom(rooms: Room[]) {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].players.length < 2 && !rooms[i].reserved) {
        return rooms[i];
      }
    }
    return null;
  }

  createRoom(rooms: Room[], reserved: boolean = false) {
    let newRoom: Room = {
      index: rooms.length,
      id: uuida(),
      players: [],
      board: null,
      viewers: [],
      reserved: reserved,
      gameOn: false,
      maxViews: 0,
    };
    rooms.push(newRoom);

    return newRoom;
  }

  getLiveRooms(rooms: Room[]) {
    let liveRooms = rooms?.filter((r) => r.players.length == 2);

    return liveRooms.map((r) => ({
      id: r.id,
      map: 'map name',
      players: r.players.map((p) => ({
        username: p.username,
        avatar: p.avatar,
      })),
    }));
  }

  removeRoom(rooms: Room[], id: string): Room[] {
    return rooms.filter((r) => r.id != id);
  }

  inWhichRoom(rooms: Room[], username: string): string {
    for (let i = 0; i < rooms.length; i++) {
      for (let j = 0; j < rooms[i].players.length; j++) {
        if (rooms[i].players[j].username == username) return rooms[i].id;
        if (rooms[i]?.viewers[j]) {
          if (rooms[i]?.viewers[j].username == username) return rooms[i].id;
        }
      }
    }
    return null;
  }

  inWhichRoomBySocket(rooms: Room[], id: string): string {
    for (let i = 0; i < rooms.length; i++) {
      for (let j = 0; j < rooms[i].players.length; j++) {
        if (rooms[i].players[j].socketId == id) return rooms[i].id;
        if (rooms[i]?.viewers[j]) {
          if (rooms[i].viewers[j].socketId == id) return rooms[i].id;
        }
      }
    }
    return null;
  }

  initBoard(room: Room) {
    let width = 600;
    let height = width * 0.45;
    let paddleWidth = width * 0.008;
    let paddleHeight = height * 0.2;
    room.board = {
      width: width,
      height: height,
      ballRadius: width * 0.02,
      paddleHeight: paddleHeight,
      paddleWidth: paddleWidth,
      player1_x: width * 0.008,
      player2_x: width - (paddleWidth + width * 0.008),
      player1_y: height / 2 - paddleHeight / 2,
      player2_y: height / 2 - paddleHeight / 2,
      ball_x: width / 2,
      ball_y: height / 2,
      ballSpeed_x: 4,
      ballSpeed_y: -4,
      leftScore: 0,
      rightScore: 0,
      player1points: 0,
      player2points: 0,
      views: 0,
    };
  }

  addPlayer(room: Room, user: any, socketId: string, playerType: string): any {
    if (!room) return;
    let player: Player = {
      username: user?.username,
      socketId: socketId,
      roomId: room?.id,
      playerType: playerType,
      avatar: user?.avatar,
      score: 0,
    };
    room.players?.push(player);
  }

  addViewerToRoom(room: Room, user: any, socketId: string) {
    let newViewer: Viewer = {
      username: user.username,
      viewerInterval: null,
      socketId: socketId,
    };
    room.viewers.push(newViewer);
    room.maxViews += 1;
    room.board.views++;
  }

  removeViewerFromRoom(room: Room, user: any): any {
    room.board.views--;
    room.viewers = room.viewers.filter((v) => v.username != user.username);
    return room;
  }

  getViewer(room: Room, username: string): any {
    return room.viewers?.find((w) => w.username == username);
  }

  getPlayer(room: Room, username: string): any {
    return room.players?.find((p) => p.username == username);
  }

  hitPaddle(room: Room, player: string): boolean {
    const [x1, y1, w1, h1] = [
      room.board.ball_x - room.board.ballRadius / 2,
      room.board.ball_y - room.board.ballRadius / 2,
      room.board.ballRadius,
      room.board.ballRadius,
    ];

    let x2 = player == 'first' ? room.board.player1_x : room.board.player2_x;
    let y2 = player == 'first' ? room.board.player1_y : room.board.player2_y;

    const w2 = room.board.paddleWidth;
    const h2 = room.board.paddleHeight;

    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }

  initBall(room: Room): void {
    room.board.ball_x = room.board.width / 2;
    room.board.ball_y = room.board.height / 2;
  }

  getLimits(room: Room): {
    top: number;
    left: number;
    right: number;
    bottom: number;
  } {
    let top = room.board.ballRadius * 0.5;
    let left = room.board.ballRadius;
    let right = room.board.width - room.board.ballRadius;
    let bottom = room.board.height - room.board.ballRadius * 0.5;
    return { top, left, right, bottom };
  }

  getNextCoordinates(room: Room): [number, number] {
    return [
      room.board.ball_x + room.board.ballSpeed_x,
      room.board.ball_y + room.board.ballSpeed_y,
    ];
  }

  updateScores(room: Room, player: string): void {
    if (player == 'first') {
      room.board.rightScore++;
      room.players[1].score++;
      room.board.player2points += 3;
    } else {
      room.board.leftScore++;
      room.players[0].score++;
      room.board.player1points += 3;
    }
  }
}
