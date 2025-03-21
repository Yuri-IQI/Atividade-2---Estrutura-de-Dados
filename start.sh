#!/bin/bash

# Start frontend
(cd "frontend" && npm run dev &)  
FRONTEND_PID=$!

# Start backend
(cd "backend" && node server.js &)  
BACKEND_PID=$!

echo "Frontend started with PID $FRONTEND_PID"
echo "Backend started with PID $BACKEND_PID"

# Function to stop processes
cleanup() {
  echo "Stopping services..."
  kill $FRONTEND_PID $BACKEND_PID
  wait $FRONTEND_PID $BACKEND_PID 2>/dev/null
  echo "Services stopped."
}

# Trap SIGINT (Ctrl+C) and SIGTERM to stop services
trap cleanup SIGINT SIGTERM

# Wait for processes to keep script running
wait $FRONTEND_PID $BACKEND_PID
