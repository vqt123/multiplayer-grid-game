#!/bin/bash
# Kill all existing server and client processes

# Kill WebSocket server (node processes running server.js)
pkill -f "node.*server/server.js" 2>/dev/null

# Kill http-server processes (client)
pkill -f "http-server.*client" 2>/dev/null

# Kill any process on port 3000 (WebSocket server)
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Kill any process on port 8080 (HTTP server)
lsof -ti:8080 | xargs kill -9 2>/dev/null

echo "All game processes terminated"