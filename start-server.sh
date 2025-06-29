#!/bin/bash
# Start WebSocket server in background

# First kill any existing processes
./kill-all.sh

# Start server in background and detach
nohup node server/server.js > server.log 2>&1 &

echo "WebSocket server started on port 3000 (PID: $!)"
echo "Server logs: tail -f server.log"