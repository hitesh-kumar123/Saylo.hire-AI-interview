from app import create_app
from app.extensions import db
from app.models import User, Resume, JobDescription, InterviewSession, InterviewResult, Cheatsheet
import sqlalchemy as sa
from sqlalchemy import text

# Create the Flask app and push an application context
app = create_app()
with app.app_context():
    # Get database engine
    engine = db.engine
    
    # Alter the user table to increase password_hash column length
    with engine.connect() as connection:
        try:
            print("Altering user table to increase password_hash column length...")
            connection.execute(text("ALTER TABLE \"user\" ALTER COLUMN password_hash TYPE VARCHAR(256)"))
            connection.commit()
            print("Table altered successfully!")
        except Exception as e:
            print(f"Error altering table: {e}")
            
    # Print the tables
    tables = db.metadata.tables.keys()
    print("\nTables in the database:")
    for table in tables:
        print(f"- {table}")
        
    print("\nDone!") 