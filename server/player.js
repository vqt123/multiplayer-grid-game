const { GRID_SIZE, COLORS } = require('../shared/constants');

class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.x = Math.floor(Math.random() * GRID_SIZE);
    this.y = Math.floor(Math.random() * GRID_SIZE);
    this.color = this.assignColor();
  }

  assignColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  move(direction) {
    const oldX = this.x;
    const oldY = this.y;

    switch (direction) {
      case 'up':
        this.y = Math.max(0, this.y - 1);
        break;
      case 'down':
        this.y = Math.min(GRID_SIZE - 1, this.y + 1);
        break;
      case 'left':
        this.x = Math.max(0, this.x - 1);
        break;
      case 'right':
        this.x = Math.min(GRID_SIZE - 1, this.x + 1);
        break;
    }

    return this.x !== oldX || this.y !== oldY;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      x: this.x,
      y: this.y,
      color: this.color
    };
  }
}

module.exports = Player;