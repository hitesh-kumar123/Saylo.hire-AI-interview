import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

try:
    # Print the database connection string from .env
    db_url = os.getenv('DATABASE_URL', 'postgresql://postgres:admin@localhost:5432/saylo_hire')
    print(f"Database URL: {db_url}")
    
    # Connect to the saylo_hire database
    conn = psycopg2.connect(
        host="localhost",
        user="postgres",
        password="admin",
        dbname="saylo_hire"
    )
    conn.autocommit = True
    cursor = conn.cursor()
    
    # Query to get all tables
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    """)
    
    tables = cursor.fetchall()
    
    print("Tables in the saylo_hire database:")
    for table in tables:
        print(f"- {table[0]}")
        
        # Get columns for each table
        cursor.execute(f"""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = '{table[0]}'
        """)
        columns = cursor.fetchall()
        
        print("  Columns:")
        for column in columns:
            print(f"  - {column[0]} ({column[1]})")
        print()
    
    # Close connection
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"Error: {e}") 