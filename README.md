# Saylo.hire

Saylo.hire is an AI-powered mock interview platform that leverages Google Gemini for question generation and cheatsheet creation, and Tavus Agent for interactive video interviews and resume data extraction. The platform provides users with scores and historical insights to help them improve their interview skills.

## Features

- User Authentication (Signup, Login, Logout)
- User Dashboard (overview of interviews)
- Resume Upload & Management
- Job Description Input
- Interview Setup (select resume, job, type)
- Gemini-powered Interview Question Generation
- Gemini-powered Cheatsheet Generation (from job description/resume keywords)
- Cheatsheet PDF Generation
- Tavus-powered Video Interview Call
- Real-time Audio/Video stream with Tavus Agent
- Post-interview scoring & feedback (via Gemini, analyzing interview transcript)
- Interview History Tracking (job title, date, score)
- User Profile Management

## Technology Stack

### Backend
- Flask (Python 3.9+)
- PostgreSQL 15
- SQLAlchemy (ORM)
- Flask-JWT-Extended (Authentication)
- Google Gemini API
- Tavus Agent API
- ReportLab (PDF generation)

### Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- LiveKit (for real-time video)

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js (LTS version)
- PostgreSQL 15
- Google Gemini API Key
- Tavus API Key

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the backend directory with the following variables:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/saylo_hire"
   SECRET_KEY="your_super_secret_key"
   JWT_SECRET_KEY="your_jwt_secret_key"
   GEMINI_API_KEY="your_gemini_api_key"
   TAVUS_API_KEY="your_tavus_api_key"
   TAVUS_API_URL="https://api.tavus.ai/v2"
   ```

6. Create the database:
   ```
   createdb saylo_hire
   ```

7. Run the Flask application:
   ```
   python run.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Run the development server:
   ```
   npm run dev
   ```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user info

### Resume Management
- `POST /api/resume/upload` - Upload a new resume
- `GET /api/resume` - Get all user resumes
- `GET /api/resume/:id` - Get specific resume
- `GET /api/resume/:id/download` - Download resume file
- `DELETE /api/resume/:id` - Delete a resume

### Job Description Management
- `POST /api/resume/job-description` - Create a new job description
- `GET /api/resume/job-description` - Get all user job descriptions
- `GET /api/resume/job-description/:id` - Get specific job description
- `PUT /api/resume/job-description/:id` - Update job description
- `DELETE /api/resume/job-description/:id` - Delete job description

### Interview Management
- `POST /api/interview/setup` - Set up a new interview
- `POST /api/interview/start` - Start an interview
- `POST /api/interview/:id/finish` - Finish an interview
- `GET /api/interview/results/:id` - Get interview results
- `GET /api/interview/results/:id/transcript` - Get interview transcript
- `GET /api/interview/history` - Get interview history
- `GET /api/interview/:id/cheatsheet` - Get interview cheatsheet
- `GET /api/interview/:id/cheatsheet/pdf` - Download cheatsheet PDF

## License

This project is licensed under the MIT License. 