/**
 * @jest-environment jsdom
 */

// Mock WebSocket
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 0;
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    this.sentMessages = [];
    
    // Store instance for testing
    MockWebSocket.instance = this;
  }

  send(data) {
    this.sentMessages.push(JSON.parse(data));
  }

  simulateOpen() {
    this.readyState = 1;
    if (this.onopen) this.onopen();
  }

  simulateMessage(data) {
    if (this.onmessage) {
      this.onmessage({ data: JSON.stringify(data) });
    }
  }

  simulateClose() {
    this.readyState = 3;
    if (this.onclose) this.onclose();
  }

  simulateError(error) {
    if (this.onerror) this.onerror(error);
  }
}

global.WebSocket = MockWebSocket;

// Setup DOM
document.body.innerHTML = `
  <div id="joinForm" style="display: block;">
    <input type="text" id="playerName" value="">
  </div>
  <canvas id="gameCanvas" style="display: none;"></canvas>
  <div id="status"></div>
  <div id="instructions" style="display: none;"></div>
`;

// Define globals
global.MESSAGES = {
  JOIN: 'join',
  MOVE: 'move',
  PLAYER_JOINED: 'playerJoined',
  PLAYER_MOVED: 'playerMoved',
  PLAYER_LEFT: 'playerLeft',
  GAME_STATE: 'gameState'
};
global.SERVER_PORT = 3000;
global.renderGame = jest.fn();

// Load client after globals are defined
require('../client');

describe('Client', () => {
  let ws;

  beforeEach(() => {
    jest.clearAllMocks();
    MockWebSocket.instance = null;
    document.getElementById('playerName').value = '';
    document.getElementById('joinForm').style.display = 'block';
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('status').textContent = '';
    document.getElementById('status').className = '';
    
    // Reset client state using the reset function
    if (global.resetClientState) {
      global.resetClientState();
    }
  });

  describe('joinGame', () => {
    test('should connect with player name', () => {
      document.getElementById('playerName').value = 'TestPlayer';
      global.joinGame();
      
      ws = MockWebSocket.instance;
      expect(ws).toBeDefined();
      expect(ws.url).toBe('ws://localhost:3000');
    });

    test('should use Anonymous if no name provided', () => {
      global.joinGame();
      
      ws = MockWebSocket.instance;
      ws.simulateOpen();
      
      expect(ws.sentMessages[0]).toEqual({
        type: 'join',
        name: 'Anonymous'
      });
    });

    test('should show connecting status', () => {
      global.joinGame();
      
      expect(document.getElementById('status').textContent).toBe('Connecting...');
    });
  });

  describe('WebSocket connection', () => {
    beforeEach(() => {
      document.getElementById('playerName').value = 'TestPlayer';
      global.joinGame();
      ws = MockWebSocket.instance;
    });

    test('should send join message on open', () => {
      ws.simulateOpen();
      
      expect(ws.sentMessages[0]).toEqual({
        type: 'join',
        name: 'TestPlayer'
      });
    });

    test('should hide join form and show canvas on connect', () => {
      ws.simulateOpen();
      
      expect(document.getElementById('joinForm').style.display).toBe('none');
      expect(document.getElementById('gameCanvas').style.display).toBe('block');
      expect(document.getElementById('instructions').style.display).toBe('block');
    });

    test('should handle disconnect', () => {
      ws.simulateOpen();
      ws.simulateClose();
      
      expect(document.getElementById('status').textContent).toBe('Disconnected from server');
      expect(document.getElementById('status').className).toBe('error');
      expect(document.getElementById('joinForm').style.display).toBe('block');
      expect(document.getElementById('gameCanvas').style.display).toBe('none');
    });
  });

  describe('message handling', () => {
    beforeEach(() => {
      global.joinGame();
      ws = MockWebSocket.instance;
      ws.simulateOpen();
    });

    test('should handle game state message', () => {
      const gameState = {
        type: 'gameState',
        players: [
          { id: 1, name: 'TestPlayer', x: 5, y: 5, color: '#FF0000' },
          { id: 2, name: 'Player2', x: 10, y: 10, color: '#00FF00' }
        ],
        gridSize: 20
      };
      
      ws.simulateMessage(gameState);
      
      expect(global.clientState.players.size).toBe(2);
      expect(global.clientState.players.get(1).name).toBe('TestPlayer');
      expect(global.renderGame).toHaveBeenCalled();
    });

    test('should handle player joined message', () => {
      const message = {
        type: 'playerJoined',
        player: { id: 3, name: 'NewPlayer', x: 15, y: 15, color: '#0000FF' }
      };
      
      ws.simulateMessage(message);
      
      expect(global.clientState.players.has(3)).toBe(true);
      expect(global.renderGame).toHaveBeenCalled();
    });

    test('should handle player moved message', () => {
      global.clientState.players.set(1, { id: 1, name: 'Player1', x: 5, y: 5, color: '#FF0000' });
      
      const message = {
        type: 'playerMoved',
        playerId: 1,
        x: 6,
        y: 5
      };
      
      ws.simulateMessage(message);
      
      expect(global.clientState.players.get(1).x).toBe(6);
      expect(global.renderGame).toHaveBeenCalled();
    });

    test('should handle player left message', () => {
      global.clientState.players.set(1, { id: 1, name: 'Player1', x: 5, y: 5, color: '#FF0000' });
      
      const message = {
        type: 'playerLeft',
        playerId: 1
      };
      
      ws.simulateMessage(message);
      
      expect(global.clientState.players.has(1)).toBe(false);
      expect(global.renderGame).toHaveBeenCalled();
    });
  });

  describe('keyboard controls', () => {
    beforeEach(() => {
      global.joinGame();
      ws = MockWebSocket.instance;
      ws.simulateOpen();
      global.clientState.myPlayerId = 1;
    });

    test('should send move message on arrow key press', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      document.dispatchEvent(event);
      
      expect(ws.sentMessages[1]).toEqual({
        type: 'move',
        direction: 'up'
      });
    });

    test('should handle all arrow keys', () => {
      const directions = [
        { key: 'ArrowUp', direction: 'up' },
        { key: 'ArrowDown', direction: 'down' },
        { key: 'ArrowLeft', direction: 'left' },
        { key: 'ArrowRight', direction: 'right' }
      ];
      
      directions.forEach(({ key, direction }) => {
        ws.sentMessages = [ws.sentMessages[0]]; // Keep only join message
        
        const event = new KeyboardEvent('keydown', { key });
        document.dispatchEvent(event);
        
        expect(ws.sentMessages[1]).toEqual({
          type: 'move',
          direction: direction
        });
      });
    });

    test('should not send move if not connected', () => {
      ws.simulateClose();
      ws.sentMessages = [];
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      document.dispatchEvent(event);
      
      expect(ws.sentMessages.length).toBe(0);
    });
  });
});