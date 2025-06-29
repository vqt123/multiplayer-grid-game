const WebSocket = require('ws');
const Game = require('./game');
const { SERVER_PORT, MESSAGES, GRID_SIZE } = require('../shared/constants');

const game = new Game();
const wss = new WebSocket.Server({ port: SERVER_PORT });

console.log(`WebSocket server running on port ${SERVER_PORT}`);

wss.on('connection', (ws) => {
  console.log('New client connected');
  let playerId = null;

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case MESSAGES.JOIN:
          handleJoin(ws, message);
          break;
        case MESSAGES.MOVE:
          if (playerId) {
            handleMove(playerId, message);
          }
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', () => {
    if (playerId) {
      handleDisconnect(playerId);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  function handleJoin(ws, message) {
    const player = game.addPlayer(message.name || 'Anonymous', ws);
    playerId = player.id;
    
    console.log(`Player ${player.name} (ID: ${player.id}) joined at (${player.x}, ${player.y})`);
    
    // Send game state to new player
    game.broadcastTo(playerId, {
      type: MESSAGES.GAME_STATE,
      players: game.getAllPlayers(),
      gridSize: GRID_SIZE
    });
    
    // Notify all players about new player
    game.broadcastToAll({
      type: MESSAGES.PLAYER_JOINED,
      player: player.toJSON()
    });
  }

  function handleMove(playerId, message) {
    const moved = game.movePlayer(playerId, message.direction);
    
    if (moved) {
      const player = game.getPlayer(playerId);
      console.log(`Player ${playerId} moved to (${player.x}, ${player.y})`);
      
      game.broadcastToAll({
        type: MESSAGES.PLAYER_MOVED,
        playerId: playerId,
        x: player.x,
        y: player.y
      });
    }
  }

  function handleDisconnect(playerId) {
    const player = game.getPlayer(playerId);
    if (player) {
      console.log(`Player ${player.name} (ID: ${playerId}) disconnected`);
      game.removePlayer(playerId);
      
      game.broadcast({
        type: MESSAGES.PLAYER_LEFT,
        playerId: playerId
      });
    }
  }
});