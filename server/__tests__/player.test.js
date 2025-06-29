const Player = require('../player');
const { GRID_SIZE } = require('../../shared/constants');

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player(1, 'TestPlayer');
  });

  describe('constructor', () => {
    test('should create player with correct properties', () => {
      expect(player.id).toBe(1);
      expect(player.name).toBe('TestPlayer');
      expect(player.x).toBeGreaterThanOrEqual(0);
      expect(player.x).toBeLessThan(GRID_SIZE);
      expect(player.y).toBeGreaterThanOrEqual(0);
      expect(player.y).toBeLessThan(GRID_SIZE);
      expect(player.color).toBeDefined();
    });
  });

  describe('move', () => {
    beforeEach(() => {
      // Set player to center for testing
      player.x = 10;
      player.y = 10;
    });

    test('should move up correctly', () => {
      const moved = player.move('up');
      expect(moved).toBe(true);
      expect(player.x).toBe(10);
      expect(player.y).toBe(9);
    });

    test('should move down correctly', () => {
      const moved = player.move('down');
      expect(moved).toBe(true);
      expect(player.x).toBe(10);
      expect(player.y).toBe(11);
    });

    test('should move left correctly', () => {
      const moved = player.move('left');
      expect(moved).toBe(true);
      expect(player.x).toBe(9);
      expect(player.y).toBe(10);
    });

    test('should move right correctly', () => {
      const moved = player.move('right');
      expect(moved).toBe(true);
      expect(player.x).toBe(11);
      expect(player.y).toBe(10);
    });

    test('should not move beyond top boundary', () => {
      player.y = 0;
      const moved = player.move('up');
      expect(moved).toBe(false);
      expect(player.y).toBe(0);
    });

    test('should not move beyond bottom boundary', () => {
      player.y = GRID_SIZE - 1;
      const moved = player.move('down');
      expect(moved).toBe(false);
      expect(player.y).toBe(GRID_SIZE - 1);
    });

    test('should not move beyond left boundary', () => {
      player.x = 0;
      const moved = player.move('left');
      expect(moved).toBe(false);
      expect(player.x).toBe(0);
    });

    test('should not move beyond right boundary', () => {
      player.x = GRID_SIZE - 1;
      const moved = player.move('right');
      expect(moved).toBe(false);
      expect(player.x).toBe(GRID_SIZE - 1);
    });
  });

  describe('toJSON', () => {
    test('should return correct JSON representation', () => {
      player.x = 5;
      player.y = 7;
      player.color = '#FF0000';
      
      const json = player.toJSON();
      
      expect(json).toEqual({
        id: 1,
        name: 'TestPlayer',
        x: 5,
        y: 7,
        color: '#FF0000'
      });
    });
  });
});