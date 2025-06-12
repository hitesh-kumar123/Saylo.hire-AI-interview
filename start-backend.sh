#!/bin/bash

echo "🚀 Starting Saylo.hire backend server..."

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run ./setup.sh first."
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create backend/.env with required configuration."
    exit 1
fi

# Start the Flask server
echo "✅ Starting Flask server on http://localhost:5000"
python run.py