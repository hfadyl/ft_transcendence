export interface board {
  width: number;
  height: number;
  frontWidth: number;
  frontHeight: number;
  coefficient: number;
  paddleHeight: number;
  paddleWidth: number;
  ballRadius: number;
  ballSpeed_x: number;
  ballSpeed_y: number;
  ball_x: number;
  ball_y: number;
  player1_x: number;
  player1_y: number;
  player2_x: number;
  player2_y: number;
  leftScore: number;
  rightScore: number;
  player1points: number;
  player2points: number;
  views: number;
}
export interface Player {
  username: string;
  socketId: string;
  roomId?: string;
  playerType: string;
  avatar?: any;
  score?: number;
  points?: number;
}
export interface Viewer {
  username: string;
  viewerInterval?: any;
  socketId: string;
}
export interface Room {
  index: number;
  id: string;
  players: Player[];
  board?: any;
  viewers: Viewer[];
  interval?: any;
  reserved?: boolean;
  gameOn: boolean;
  maxViews: number;
}
