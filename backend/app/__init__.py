from flask import Flask
from app.config import Config
from app.extensions import db, jwt, cors
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Create upload and PDF folders if they don't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['GENERATED_PDFS_FOLDER'], exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Configure CORS to handle credentials properly
    cors.init_app(app, 
                 resources={r"/*": {"origins": "*"}},
                 supports_credentials=True,
                 allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"])

    with app.app_context():
        # Import and register blueprints
        from app.routes.auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        
        from app.routes.resume import resume_bp
        app.register_blueprint(resume_bp, url_prefix='/api/resume')
        
        from app.routes.interview import interview_bp
        app.register_blueprint(interview_bp, url_prefix='/api/interview')

        # Create database tables based on models
        db.create_all()

    return app 