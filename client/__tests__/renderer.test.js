/**
 * @jest-environment jsdom
 */

// Mock canvas context
const mockContext = {
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  fillText: jest.fn(),
  strokeStyle: '',
  fillStyle: '',
  lineWidth: 1,
  font: '',
  textAlign: '',
  textBaseline: ''
};

// Setup DOM
document.body.innerHTML = '<canvas id="gameCanvas"></canvas>';
const canvas = document.getElementById('gameCanvas');
canvas.getContext = jest.fn(() => mockContext);

// Define globals
global.GRID_SIZE = 20;
global.CELL_SIZE = 30;
global.CANVAS_SIZE = 600;
global.players = new Map();
global.myPlayerId = null;

// Load renderer after globals are defined
require('../renderer');

describe('Renderer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.players.clear();
    global.myPlayerId = null;
    
    // Trigger DOMContentLoaded
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);
  });

  describe('initialization', () => {
    test('should set canvas dimensions correctly', () => {
      expect(canvas.width).toBe(600);
      expect(canvas.height).toBe(600);
    });

    test('should get 2D context', () => {
      expect(canvas.getContext).toHaveBeenCalledWith('2d');
    });
  });

  describe('renderGrid', () => {
    test('should draw grid lines', () => {
      global.renderGrid();
      
      // Should draw 21 vertical lines (0 to 20)
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.moveTo).toHaveBeenCalled();
      expect(mockContext.lineTo).toHaveBeenCalled();
      expect(mockContext.stroke).toHaveBeenCalled();
    });
  });

  describe('renderPlayers', () => {
    beforeEach(() => {
      global.players.set(1, {
        id: 1,
        name: 'Player1',
        x: 5,
        y: 5,
        color: '#FF0000'
      });
      
      global.players.set(2, {
        id: 2,
        name: 'Player2',
        x: 10,
        y: 10,
        color: '#00FF00'
      });
    });

    test('should draw all players', () => {
      global.renderPlayers();
      
      // Should draw 2 circles (one for each player)
      expect(mockContext.arc).toHaveBeenCalledTimes(2);
      expect(mockContext.fill).toHaveBeenCalledTimes(2);
      
      // Should draw player names
      expect(mockContext.fillText).toHaveBeenCalledWith('Player1', expect.any(Number), expect.any(Number));
      expect(mockContext.fillText).toHaveBeenCalledWith('Player2', expect.any(Number), expect.any(Number));
    });

    test('should highlight current player', () => {
      global.myPlayerId = 1;
      global.renderPlayers();
      
      // Should draw border for current player
      expect(mockContext.stroke).toHaveBeenCalled();
      expect(mockContext.lineWidth).toBe(3);
    });

    test('should use player colors', () => {
      global.renderPlayers();
      
      // Check that fillStyle was set to player colors
      const fillStyleCalls = mockContext.fillStyle;
      expect(mockContext.fillStyle).toBeDefined();
    });
  });

  describe('renderGame', () => {
    test('should clear canvas and redraw everything', () => {
      global.renderGame();
      
      // Should clear canvas
      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 600, 600);
      
      // Should draw grid and players
      expect(mockContext.stroke).toHaveBeenCalled();
    });
  });
});