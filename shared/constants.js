const GRID_SIZE = 20;
const CELL_SIZE = 30;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const SERVER_PORT = 3000;

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#48DBFB', '#FF9FF3', '#54A0FF', '#FD79A8', '#A29BFE'
];

const MESSAGES = {
  JOIN: 'join',
  MOVE: 'move',
  PLAYER_JOINED: 'playerJoined',
  PLAYER_MOVED: 'playerMoved',
  PLAYER_LEFT: 'playerLeft',
  GAME_STATE: 'gameState'
};

const DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
};

module.exports = {
  GRID_SIZE,
  CELL_SIZE,
  CANVAS_SIZE,
  SERVER_PORT,
  COLORS,
  MESSAGES,
  DIRECTIONS
};