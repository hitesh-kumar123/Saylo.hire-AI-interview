#!/bin/bash

echo "🚀 Starting Saylo.hire Frontend..."

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend directory not found. Please run from project root."
    exit 1
fi

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not installed. Please run ./setup.sh first."
    exit 1
fi

# Start the development server
echo "Starting React development server on http://localhost:3000..."
npm run dev