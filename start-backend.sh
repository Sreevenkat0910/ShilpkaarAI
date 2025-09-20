#!/bin/bash

# Start script for ShilpkaarAI backend with proper environment variables
# This ensures the backend always starts with the correct JWT_SECRET

echo "🚀 Starting ShilpkaarAI Backend Server..."

# Set environment variables
export MONGODB_URI="mongodb://localhost:27017/shilpkaarai"
export PORT="5001"
export FRONTEND_URL="http://localhost:3000"
export JWT_SECRET="shilpkaarai_super_secret_jwt_key_2024_development_only"

# Change to backend directory
cd "$(dirname "$0")/backend"

# Start the server
echo "📡 Starting server on port $PORT with JWT_SECRET configured..."
node server.js
