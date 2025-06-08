from app import create_app
from app.extensions import db
from app.models import User, Resume, JobDescription, InterviewSession, InterviewResult, Cheatsheet

# Create the Flask app and push an application context
app = create_app()
with app.app_context():
    print("Creating database tables...")
    db.create_all()
    print("Tables created successfully!")
    
    # Print the tables that were created
    tables = db.metadata.tables.keys()
    print("\nCreated tables:")
    for table in tables:
        print(f"- {table}") 