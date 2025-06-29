const Game = require('../game');
const { MESSAGES } = require('../../shared/constants');

// Mock WebSocket
class MockWebSocket {
  constructor() {
    this.readyState = 1; // OPEN
    this.sentMessages = [];
  }

  send(message) {
    this.sentMessages.push(JSON.parse(message));
  }
}

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  describe('addPlayer', () => {
    test('should add new player with incrementing ID', () => {
      const ws1 = new MockWebSocket();
      const ws2 = new MockWebSocket();

      const player1 = game.addPlayer('Player1', ws1);
      const player2 = game.addPlayer('Player2', ws2);

      expect(player1.id).toBe(1);
      expect(player1.name).toBe('Player1');
      expect(player2.id).toBe(2);
      expect(player2.name).toBe('Player2');
      expect(game.players.size).toBe(2);
    });
  });

  describe('removePlayer', () => {
    test('should remove player from game', () => {
      const ws = new MockWebSocket();
      const player = game.addPlayer('TestPlayer', ws);
      
      game.removePlayer(player.id);
      
      expect(game.players.size).toBe(0);
      expect(game.getPlayer(player.id)).toBeNull();
    });
  });

  describe('getPlayer', () => {
    test('should return player by ID', () => {
      const ws = new MockWebSocket();
      const player = game.addPlayer('TestPlayer', ws);
      
      const retrieved = game.getPlayer(player.id);
      
      expect(retrieved).toBe(player);
    });

    test('should return null for non-existent player', () => {
      expect(game.getPlayer(999)).toBeNull();
    });
  });

  describe('movePlayer', () => {
    test('should move existing player', () => {
      const ws = new MockWebSocket();
      const player = game.addPlayer('TestPlayer', ws);
      player.x = 10;
      player.y = 10;
      
      const moved = game.movePlayer(player.id, 'up');
      
      expect(moved).toBe(true);
      expect(player.y).toBe(9);
    });

    test('should return false for non-existent player', () => {
      const moved = game.movePlayer(999, 'up');
      expect(moved).toBe(false);
    });
  });

  describe('getAllPlayers', () => {
    test('should return array of all player data', () => {
      const ws1 = new MockWebSocket();
      const ws2 = new MockWebSocket();
      
      game.addPlayer('Player1', ws1);
      game.addPlayer('Player2', ws2);
      
      const allPlayers = game.getAllPlayers();
      
      expect(allPlayers).toHaveLength(2);
      expect(allPlayers[0]).toHaveProperty('id');
      expect(allPlayers[0]).toHaveProperty('name');
      expect(allPlayers[0]).toHaveProperty('x');
      expect(allPlayers[0]).toHaveProperty('y');
      expect(allPlayers[0]).toHaveProperty('color');
    });
  });

  describe('broadcast methods', () => {
    let ws1, ws2, ws3;
    let player1, player2, player3;

    beforeEach(() => {
      ws1 = new MockWebSocket();
      ws2 = new MockWebSocket();
      ws3 = new MockWebSocket();
      
      player1 = game.addPlayer('Player1', ws1);
      player2 = game.addPlayer('Player2', ws2);
      player3 = game.addPlayer('Player3', ws3);
    });

    test('broadcastTo should send message to specific player', () => {
      const message = { type: 'test', data: 'hello' };
      
      game.broadcastTo(player2.id, message);
      
      expect(ws1.sentMessages).toHaveLength(0);
      expect(ws2.sentMessages).toHaveLength(1);
      expect(ws2.sentMessages[0]).toEqual(message);
      expect(ws3.sentMessages).toHaveLength(0);
    });

    test('broadcast should send to all except excluded player', () => {
      const message = { type: 'test', data: 'hello' };
      
      game.broadcast(message, player2.id);
      
      expect(ws1.sentMessages).toHaveLength(1);
      expect(ws2.sentMessages).toHaveLength(0);
      expect(ws3.sentMessages).toHaveLength(1);
    });

    test('broadcastToAll should send to all players', () => {
      const message = { type: 'test', data: 'hello' };
      
      game.broadcastToAll(message);
      
      expect(ws1.sentMessages).toHaveLength(1);
      expect(ws2.sentMessages).toHaveLength(1);
      expect(ws3.sentMessages).toHaveLength(1);
    });

    test('should not send to disconnected players', () => {
      ws2.readyState = 3; // CLOSED
      const message = { type: 'test', data: 'hello' };
      
      game.broadcastToAll(message);
      
      expect(ws1.sentMessages).toHaveLength(1);
      expect(ws2.sentMessages).toHaveLength(0);
      expect(ws3.sentMessages).toHaveLength(1);
    });
  });

  describe('getPlayerIdByWs', () => {
    test('should return player ID for given WebSocket', () => {
      const ws = new MockWebSocket();
      const player = game.addPlayer('TestPlayer', ws);
      
      const playerId = game.getPlayerIdByWs(ws);
      
      expect(playerId).toBe(player.id);
    });

    test('should return null for unknown WebSocket', () => {
      const ws = new MockWebSocket();
      
      const playerId = game.getPlayerIdByWs(ws);
      
      expect(playerId).toBeNull();
    });
  });
});