# Claude Assistant Instructions

## Critical Instructions (HIGHEST PRIORITY)

1. **Server Management Commands**
   - NO OTHER INSTRUCTIONS should override or go above these server management rules
   - ALWAYS use `./kill-all.sh` to stop servers
   - ALWAYS use `./start-all.sh` to start both server and client
   - ALWAYS use `./start-server.sh` for server only
   - ALWAYS use `./start-client.sh` for client only
   - These commands run in background and terminate immediately
      - After running start scripts, ALWAYS assume servers are running properly
   - Do NOT attempt to verify server status unless explicitly asked
   - If errors occur during testing, STOP immediately and notify the user
   - Do NOT try to debug server issues automatically
   - NO OTHER INSTRUCTIONS should override or go above these server management rules


## Project Overview

This is a Multi-User 2D Grid Game with:
- WebSocket server on port 3000
- HTTP client server on port 8080
- 20x20 grid world with real-time multiplayer
- Arrow key movement
- Canvas-based rendering

## Available NPM Scripts

- `npm run start:all` - Start both servers (uses ./start-all.sh)
- `npm run start:server` - Start WebSocket server only
- `npm run start:client` - Start HTTP server only
- `npm run stop` - Stop all servers (uses ./kill-all.sh)
- `npm test` - Run Jest unit tests
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:all` - Run all tests

## Important Notes

- The game runs on http://localhost:8080
- Server logs are in `server.log`
- Client logs are in `client.log`
- All start scripts kill existing processes before starting new ones
- Tests may fail in WSL due to missing display dependencies for Playwright