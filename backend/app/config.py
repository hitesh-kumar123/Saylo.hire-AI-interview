import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:admin@localhost:5432/saylo_hire')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default_jwt_secret_key')
    
    # JWT Configuration - longer token lifespans
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    TAVUS_API_KEY = os.getenv('TAVUS_API_KEY')
    TAVUS_API_URL = os.getenv('TAVUS_API_URL')
    # Add paths for storing uploaded files and generated PDFs
    UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'uploads')
    GENERATED_PDFS_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'generated_pdfs') 