#!/bin/bash

echo "🚀 Starting Saylo.hire frontend server..."

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Node modules not found. Please run ./setup.sh first."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create frontend/.env with required configuration."
    exit 1
fi

# Start the Vite development server
echo "✅ Starting Vite server on http://localhost:3000"
npm run dev