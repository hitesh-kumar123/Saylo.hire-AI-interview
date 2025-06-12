#!/bin/bash

echo "🚀 Starting Saylo.hire Backend..."

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found. Please run from project root."
    exit 1
fi

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run ./setup.sh first."
    exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
if ! python -c "import flask" 2>/dev/null; then
    echo "❌ Dependencies not installed. Please run ./setup.sh first."
    exit 1
fi

# Start the Flask application
echo "Starting Flask server on http://localhost:5000..."
export FLASK_APP=run.py
export FLASK_ENV=development
python run.py