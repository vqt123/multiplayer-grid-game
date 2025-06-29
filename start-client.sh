#!/bin/bash
# Start HTTP server for client in background

# Kill any existing client server
pkill -f "http-server.*client" 2>/dev/null
lsof -ti:8080 | xargs kill -9 2>/dev/null

# Start client server in background and detach
nohup npx http-server client -p 8080 > client.log 2>&1 &

echo "HTTP server started on port 8080 (PID: $!)"
echo "Client URL: http://localhost:8080"
echo "Client logs: tail -f client.log"