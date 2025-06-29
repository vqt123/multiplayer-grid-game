# Multi-User 2D Grid Client-Server Project Plan

## Architecture Overview

- **Server**: Node.js with WebSocket support for real-time communication
- **Client**: HTML5 Canvas for rendering, JavaScript for game logic
- **Protocol**: JSON-based messages over WebSocket
- **Testing**: Jest for unit tests + Playwright for visual/integration tests

## Project Structure

```
/wsl-code/test/
├── server/
│   ├── server.js          # Main server file
│   ├── game.js            # Game logic and state management
│   ├── player.js          # Player class
│   └── __tests__/         # Server unit tests
├── client/
│   ├── index.html         # Main HTML file
│   ├── client.js          # Client connection and game logic
│   ├── renderer.js        # Canvas rendering
│   └── __tests__/         # Client unit tests
├── shared/
│   └── constants.js       # Shared constants (grid size, etc.)
├── tests/
│   ├── e2e/               # Playwright end-to-end tests
│   │   ├── game.spec.js   # Game functionality tests
│   │   └── multiplayer.spec.js # Multi-client tests
│   └── fixtures/          # Test helpers and fixtures
├── package.json           # Dependencies and scripts
├── jest.config.js         # Jest configuration
└── playwright.config.js   # Playwright configuration
```

## Implementation Steps

### 1. Server Implementation
- WebSocket server setup
- Game state management (grid, players)
- Player connection/disconnection handling
- Movement validation and broadcasting

### 2. Client Implementation
- WebSocket connection management
- Canvas-based 2D grid rendering
- Keyboard input handling (arrow keys)
- Smooth player movement display

### 3. Game Features
- 20x20 grid world
- Players spawn at random positions
- Arrow key movement (up, down, left, right)
- Real-time position updates for all players
- Different colors for each player
- Player disconnect handling

### 4. Testing Strategy

**Jest Unit Tests:**
- Server: connection handling, movement validation, state management
- Client: game logic, input handling, message processing
- Mock WebSocket connections for isolated testing

**Playwright E2E Tests:**
- Visual verification of canvas elements
- Player visibility on grid
- Movement animation testing
- Multi-player interaction testing
- Screenshot comparison for regression testing
- Test scenarios:
  - Single player joins and sees grid
  - Player movement updates canvas
  - Multiple players see each other
  - Player disconnect removes from canvas
  - Grid boundaries are respected visually

## Technologies
- **Server**: Node.js, ws (WebSocket library)
- **Client**: Vanilla JavaScript, HTML5 Canvas
- **Unit Testing**: Jest, jest-environment-jsdom
- **E2E Testing**: Playwright
- **Dev Tools**: nodemon, concurrently (run server + tests)

## Test Commands
```json
{
  "scripts": {
    "test": "jest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm test && npm run test:e2e"
  }
}
```

## Message Protocol

### Client → Server
```javascript
// Join game
{ type: 'join', name: 'PlayerName' }

// Move player
{ type: 'move', direction: 'up' | 'down' | 'left' | 'right' }
```

### Server → Client
```javascript
// Player joined (including self)
{ type: 'playerJoined', player: { id, name, x, y, color } }

// Player moved
{ type: 'playerMoved', playerId, x, y }

// Player left
{ type: 'playerLeft', playerId }

// Initial game state (sent on join)
{ type: 'gameState', players: [...], gridSize: 20 }
```