# Saylo.hire Setup Guide

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js (LTS version)
- PostgreSQL 15+

### Automated Setup
Run the setup script to install all dependencies:
```bash
./setup.sh
```

### Manual Setup

#### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create PostgreSQL database:
   ```bash
   createdb saylo_hire
   ```

5. Create database tables:
   ```bash
   python create_tables.py
   ```

6. Create test user:
   ```bash
   python create_test_user.py
   ```

#### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

### Configuration

#### Backend Environment Variables
Create `backend/.env` file with:
```env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/saylo_hire
SECRET_KEY=your_super_secret_key
JWT_SECRET_KEY=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
TAVUS_API_KEY=your_tavus_api_key
TAVUS_API_URL=https://api.tavus.ai/v2
```

#### Frontend Environment Variables
Create `frontend/.env` file with:
```env
VITE_API_URL=http://localhost:5000
```

### Running the Application

#### Option 1: Using Scripts
```bash
# Start backend (in one terminal)
./start-backend.sh

# Start frontend (in another terminal)
./start-frontend.sh
```

#### Option 2: Manual Start
```bash
# Backend
cd backend
source venv/bin/activate
python run.py

# Frontend (in new terminal)
cd frontend
npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Test Credentials
- Email: test@example.com
- Password: password123

### API Keys Required
1. **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Tavus API Key**: Get from [Tavus Dashboard](https://tavus.io)

### Troubleshooting

#### Database Issues
```bash
# Check if PostgreSQL is running
pg_ctl status

# Restart PostgreSQL service
sudo service postgresql restart  # Linux
brew services restart postgresql  # macOS
```

#### Python Dependencies
```bash
# If you get import errors, ensure virtual environment is activated
source backend/venv/bin/activate
pip install -r backend/requirements.txt
```

#### Node.js Dependencies
```bash
# If you get module errors
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Development Notes
- The backend runs on port 5000
- The frontend runs on port 3000 with proxy to backend
- Database tables are created automatically on first run
- A test user is created for immediate testing