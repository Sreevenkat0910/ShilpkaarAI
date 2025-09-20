#!/bin/bash

# Script to ensure frontend runs on port 3000
# This script kills any process using port 3000 and starts the frontend

echo "🚀 Starting ShilpkaarAI Frontend on Port 3000..."

# Kill any process using port 3000
echo "🔍 Checking for processes on port 3000..."
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Port 3000 is in use. Killing existing processes..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
    echo "✅ Port 3000 is now free"
else
    echo "✅ Port 3000 is available"
fi

# Start the frontend
echo "🎯 Starting frontend on port 3000..."
cd frontend && npm run dev
