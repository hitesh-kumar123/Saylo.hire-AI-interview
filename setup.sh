#!/bin/bash

echo "🚀 Setting up Saylo.hire Project..."

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Create virtual environment with system site packages to avoid _signal module issues
echo "Creating Python virtual environment..."
python3 -m venv venv --system-site-packages

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Go back to project root
cd ..

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend

# Initialize package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    echo "Initializing frontend project..."
    npm init -y
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Go back to project root
cd ..

echo "✅ Dependencies installed successfully!"

# Database setup
echo "🗄️ Setting up database..."
cd backend

# Activate virtual environment
source venv/bin/activate

# Check if PostgreSQL is available
if command -v psql &> /dev/null; then
    echo "Setting up PostgreSQL database..."
    # Try to create database (will fail gracefully if already exists)
    createdb saylo_hire 2>/dev/null || echo "Database may already exist"
    
    # Create tables
    echo "Creating database tables..."
    python create_tables.py 2>/dev/null || echo "Tables may already exist"
    
    # Create test user
    echo "Creating test user..."
    python create_test_user.py 2>/dev/null || echo "Test user may already exist"
else
    echo "⚠️  PostgreSQL not found. You'll need to set up the database manually."
fi

cd ..

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update API keys in backend/.env"
echo "2. Start backend: ./start-backend.sh"
echo "3. Start frontend: ./start-frontend.sh"
echo "4. Visit http://localhost:3000"