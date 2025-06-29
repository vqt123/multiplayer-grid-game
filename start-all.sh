#!/bin/bash
# Start both server and client in background

# Kill all existing processes first
./kill-all.sh

# Start WebSocket server
nohup node server/server.js > server.log 2>&1 &
echo "WebSocket server started on port 3000 (PID: $!)"

# Wait a moment for server to start
sleep 1

# Start HTTP server for client
nohup npx http-server client -p 8080 > client.log 2>&1 &
echo "HTTP server started on port 8080 (PID: $!)"

echo ""
echo "Game is running!"
echo "Client URL: http://localhost:8080"
echo "Server logs: tail -f server.log"
echo "Client logs: tail -f client.log"
echo ""
echo "To stop all: ./kill-all.sh"