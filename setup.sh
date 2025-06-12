#!/bin/bash

echo "🚀 Setting up Saylo.hire project..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js LTS first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 15+ first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Setup Backend
echo "📦 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Create database if it doesn't exist
echo "Setting up database..."
createdb saylo_hire 2>/dev/null || echo "Database 'saylo_hire' already exists or couldn't be created"

# Create tables
echo "Creating database tables..."
python create_tables.py

# Create test user
echo "Creating test user..."
python create_test_user.py

cd ..

# Setup Frontend
echo "📦 Setting up frontend..."
cd frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

cd ..

echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Update backend/.env with your API keys:"
echo "   - Get Gemini API key from: https://makersuite.google.com/app/apikey"
echo "   - Get Tavus API key from: https://tavus.io"
echo ""
echo "2. Start the backend server:"
echo "   cd backend && source venv/bin/activate && python run.py"
echo ""
echo "3. Start the frontend server (in a new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open your browser to: http://localhost:3000"
echo ""
echo "📧 Test user credentials:"
echo "   Email: test@example.com"
echo "   Password: password123"