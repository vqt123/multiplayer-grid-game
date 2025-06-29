const Player = require('./player');
const { MESSAGES, GRID_SIZE } = require('../shared/constants');

class Game {
  constructor() {
    this.players = new Map();
    this.nextPlayerId = 1;
  }

  addPlayer(name, ws) {
    const playerId = this.nextPlayerId++;
    const player = new Player(playerId, name);
    this.players.set(playerId, { player, ws });
    
    return player;
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
  }

  getPlayer(playerId) {
    const playerData = this.players.get(playerId);
    return playerData ? playerData.player : null;
  }

  movePlayer(playerId, direction) {
    const player = this.getPlayer(playerId);
    if (!player) return false;
    
    return player.move(direction);
  }

  getAllPlayers() {
    const players = [];
    for (const [id, data] of this.players) {
      players.push(data.player.toJSON());
    }
    return players;
  }

  broadcastTo(playerId, message) {
    const playerData = this.players.get(playerId);
    if (playerData && playerData.ws.readyState === 1) {
      playerData.ws.send(JSON.stringify(message));
    }
  }

  broadcast(message, excludePlayerId = null) {
    for (const [id, data] of this.players) {
      if (id !== excludePlayerId && data.ws.readyState === 1) {
        data.ws.send(JSON.stringify(message));
      }
    }
  }

  broadcastToAll(message) {
    for (const [id, data] of this.players) {
      if (data.ws.readyState === 1) {
        data.ws.send(JSON.stringify(message));
      }
    }
  }

  getPlayerIdByWs(ws) {
    for (const [id, data] of this.players) {
      if (data.ws === ws) {
        return id;
      }
    }
    return null;
  }
}

module.exports = Game;