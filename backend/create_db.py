import psycopg2

try:
    # Connect to the default 'postgres' database
    conn = psycopg2.connect(
        host="localhost",
        user="postgres",
        password="admin",
        dbname="postgres"
    )
    conn.autocommit = True
    cursor = conn.cursor()
    
    # Drop database if it exists
    cursor.execute("DROP DATABASE IF EXISTS saylo_hire")
    
    # Create database
    cursor.execute("CREATE DATABASE saylo_hire")
    
    print("Database 'saylo_hire' created successfully!")
    
    # Close connection
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"Error: {e}") 