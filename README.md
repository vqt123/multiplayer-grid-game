# Multi-User 2D Grid Game

A real-time multiplayer grid-based game with WebSocket communication, HTML5 Canvas rendering, and comprehensive testing.

## Features

- Real-time multiplayer gameplay
- 20x20 grid world
- Arrow key movement
- Unique player colors
- Player name display
- Automatic disconnect handling

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open the client:
- Navigate to `http://localhost:8080` in your browser
- Or use the development server: `npm run serve`

## Development

### Project Structure
- `server/` - WebSocket server and game logic
- `client/` - Browser-based game client
- `shared/` - Shared constants
- `tests/` - Test suites

### Available Scripts

- `npm start` - Start the WebSocket server
- `npm run dev` - Start server with auto-reload
- `npm run serve` - Run both server and client dev server
- `npm test` - Run Jest unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Run Playwright tests with UI
- `npm run test:all` - Run all tests

## Testing

### Unit Tests (Jest)
- Server-side game logic
- Client-side state management
- Mock WebSocket connections

### E2E Tests (Playwright)
- Visual canvas rendering
- Player movement
- Multiplayer interactions
- Connection handling
- Automated screenshot capture for visual verification
- Screenshots saved to `screenshots/` directory (gitignored)

## How to Play

1. Enter your name and click "Join Game"
2. Use arrow keys to move around the grid
3. See other players in real-time
4. Your player has a dark border

## Technical Details

- **Server**: Node.js with `ws` WebSocket library
- **Client**: Vanilla JavaScript with HTML5 Canvas
- **Protocol**: JSON messages over WebSocket
- **Testing**: Jest + Playwright
- **Grid Size**: 20x20 cells
- **Canvas Size**: 600x600 pixels