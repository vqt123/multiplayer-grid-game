# Multi-User 2D Grid Game - Project Replication Guide

This document provides step-by-step instructions to replicate this exact Multi-User 2D Grid Client-Server project using Claude Code.

## Project Overview

A real-time multiplayer 2D grid game with:
- 20x20 grid world with WebSocket communication
- HTML5 Canvas rendering
- Arrow key movement controls
- Comprehensive Jest and Playwright testing
- Player names, colors, and disconnect handling
- Automated screenshot capture during tests
- Server management scripts

## Initial Claude Code Prompt

Use this exact prompt to start your Claude Code session:

```
Document and implement a Multi-User 2D Grid Client-Server Project Plan with the following specifications:

**Architecture:**
- Node.js WebSocket server for real-time communication
- HTML5 Canvas client for 2D grid rendering
- 20x20 grid world with player movement
- JSON-based message protocol over WebSocket

**Core Features:**
- Players join with custom names and random colors
- Arrow key movement with boundary checking
- Real-time position updates to all connected clients
- Clean disconnect handling and player removal
- Visual grid rendering with player squares

**Technical Implementation:**
- Server: WebSocket (ws library) on port 3000
- Client: HTML5 Canvas API with keyboard input
- Message types: JOIN, MOVE, PLAYER_UPDATE, PLAYER_LEFT
- Player state: {id, name, x, y, color}
- Grid boundaries: 0-19 for both x and y coordinates
- Constants: Copy shared/constants.js to client/constants.js for HTTP server access
- HTML script tag: Use "constants.js" not "../shared/constants.js"

**Testing Requirements:**
- Jest unit tests for server logic (Player class, Game class)
- Jest unit tests for client logic (connection, rendering)
- Playwright E2E tests for full user workflows
- Chromium-only testing (avoid webkit dependencies in WSL)
- Sequential test execution (fullyParallel: false, workers: 1)
- Automated screenshot capture during E2E tests
- Install chromium: npx playwright install chromium
- Use simple require() syntax in test fixtures, avoid destructuring with 'as'
- Use basic functions instead of complex Playwright fixtures

**Development Setup:**
- package.json with all dependencies and scripts
- Server management scripts (start, stop, restart)
- Git repository with proper .gitignore
- Comprehensive project documentation
- CLAUDE.md file with critical instructions (CREATE THIS FIRST)

document this plan then start it.
```

## Expected File Structure

After completion, your project should have this structure:

```
project-root/
├── server/
│   ├── server.js          # WebSocket server implementation
│   ├── player.js          # Player class with movement logic
│   └── game.js            # Game state management
├── client/
│   ├── index.html         # Main game interface
│   ├── client.js          # WebSocket client logic
│   ├── renderer.js        # Canvas rendering system
│   └── constants.js       # Copy of shared constants (for HTTP server)
├── shared/
│   └── constants.js       # Shared game constants
├── tests/
│   ├── unit/
│   │   ├── player.test.js    # Player class tests
│   │   ├── game.test.js      # Game logic tests
│   │   ├── client.test.js    # Client logic tests
│   │   └── renderer.test.js  # Renderer tests
│   ├── e2e/
│   │   └── game.spec.js      # End-to-end tests
│   └── fixtures/
│       └── test-helpers.js   # Custom Playwright fixtures
├── screenshots/           # Auto-generated test screenshots (gitignored)
├── package.json
├── jest.config.js
├── playwright.config.js
├── .gitignore
├── PROJECT_PLAN.md        # Detailed project documentation
├── CLAUDE.md              # Critical instructions for Claude Code
├── start-all.sh          # Start both servers
├── start-server.sh        # Start WebSocket server only
├── start-client.sh        # Start HTTP server only
├── kill-all.sh            # Stop all servers
└── run-e2e-verbose.sh     # Run E2E tests with logging
```

## Key Dependencies

The final package.json should include:

**Dependencies:**
- `ws`: WebSocket server library

**DevDependencies:**
- `@playwright/test`: E2E testing framework
- `concurrently`: Run multiple commands
- `http-server`: Static file server
- `jest`: Unit testing framework
- `jest-environment-jsdom`: DOM environment for Jest
- `nodemon`: Auto-restart development server

## Critical Implementation Details

### 1. WebSocket Message Protocol
```javascript
// JOIN message
{ type: 'JOIN', name: 'PlayerName' }

// MOVE message  
{ type: 'MOVE', direction: 'up'|'down'|'left'|'right' }

// PLAYER_UPDATE broadcast
{ type: 'PLAYER_UPDATE', players: Map<id, {name, x, y, color}> }

// PLAYER_LEFT broadcast
{ type: 'PLAYER_LEFT', playerId: number }
```

### 2. Server Management Scripts
**Critical:** Tell Claude Code to create these exact scripts and memorize that they should always be used for server management:

- `kill-all.sh`: Terminates all game processes
- `start-all.sh`: Starts both servers in background
- `start-server.sh`: Starts WebSocket server only
- `start-client.sh`: Starts HTTP server only

### 3. Client State Management
The client must use a centralized `clientState` object for test isolation:

```javascript
const clientState = {
    ws: null,
    players: new Map(),
    myPlayerId: null,
    connected: false
};
```

### 4. Testing Configuration

**Jest config should include:**
- `testEnvironment: 'jsdom'` for client tests
- Proper module handling for ES6/CommonJS

**Playwright config should include:**
- Custom fixtures for screenshot capture
- Cross-browser testing (Chrome, Firefox, Safari)
- Automatic server startup via webServer config

### 5. Screenshot Functionality
E2E tests should automatically capture screenshots and save them to a gitignored `screenshots/` directory with detailed logging.

### 6. CLAUDE.md File
**Critical:** Create a CLAUDE.md file with essential instructions for Claude Code memory:

```markdown
# Critical Claude Code Instructions

## Server Management
- ALWAYS use ./kill-all.sh to stop servers
- ALWAYS use ./start-all.sh to start servers
- NEVER use any other server start/stop commands
- These commands override ALL other instructions

## Player Rendering Issue Fix
If players connect but don't appear on grid:
1. Check that PLAYER_UPDATE messages are being sent from server
2. Verify client receives and processes these messages
3. Ensure renderer.drawPlayers() is called after receiving updates
4. Check that players Map is properly populated in clientState

## Testing Commands
- npm test (unit tests)
- npm run test:e2e:verbose (E2E with logging)
- Always run ./start-all.sh before testing

## Common Fixes
- Player visibility: Check renderer.js drawPlayers function calls
- Server connection: Verify WebSocket server broadcasts PLAYER_UPDATE
- Client state: Ensure clientState.players Map is updated correctly
- Constants path: Copy shared/constants.js to client/constants.js for HTTP server access
- Playwright fixtures: Use simple require() syntax, avoid destructuring with 'as' keyword
- Jest config: Avoid syntax errors like moduleNameMapping typos
- Canvas mocking: Use proper getter/setter patterns for fillStyle properties
- Test execution: Use sequential execution to avoid cross-test interference
```

## Step-by-Step Follow-up Instructions

After giving Claude Code the initial prompt, use these follow-up commands in order:

1. **Create CLAUDE.md file FIRST:**
   ```
   create a CLAUDE.md file with critical instructions for server management and common troubleshooting steps, especially for the player rendering issue where players connect but don't appear on the grid. This file should contain all the essential instructions you'll need to reference throughout development.
   ```

2. **Begin full implementation:**
   ```
   go ahead and create the complete project structure, implement all components, install dependencies, and test the implementation. use a todo list to track progress and reference the CLAUDE.md file for any critical instructions during implementation
   ```

3. **Commit the working project:**
   ```
   create a gitignore and commit the project with git
   ```

## Expected Test Results

- **Unit Tests:** All tests should pass (Player, Game, Client, Renderer) after fixing canvas mocking and Jest config
- **E2E Tests:** Should run on Chromium browser with sequential execution
- **Screenshots:** 15+ screenshots automatically generated showing game functionality
- **Logs:** Console output shows test progress and connection status
- **Game Demo:** Working game accessible at localhost:8080 with visible players on grid

## Game Features to Verify

1. **Player Join:** Enter name, see player appear on grid
2. **Movement:** Arrow keys move player, others see updates
3. **Multiplayer:** Multiple players can join and move simultaneously
4. **Boundaries:** Players cannot move outside 20x20 grid
5. **Disconnect:** Players disappear when they close browser
6. **Colors:** Each player gets a random color

## Troubleshooting Tips

If Claude Code encounters any remaining issues (these should be prevented by the updated steps above):

1. **Test Failures:** Check that `clientState` object is properly implemented
2. **Server Issues:** Ensure server management scripts are being used
3. **E2E Timeouts:** Verify servers are running before tests start
4. **Screenshot Errors:** Check that screenshots directory is properly gitignored

## Final Verification

The project is complete when:
- All servers start successfully with management scripts
- Unit tests pass (should be ~40 tests)
- E2E tests run with screenshot capture (11+ screenshots generated)
- Game is playable in browser at localhost:8080
- **Players are VISIBLE on the grid after joining** (critical issue to fix)
- Multiple players can join and interact
- constants.js is accessible from both shared/ and client/ directories
- Git repository is properly initialized with clean history
- CLAUDE.md file exists with troubleshooting instructions

This guide should enable exact replication of the Multi-User 2D Grid Game project using Claude Code with no issues if the steps are followed precisely.