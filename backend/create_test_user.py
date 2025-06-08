from app import create_app
from app.models.user import User
from app.extensions import db

app = create_app()

with app.app_context():
    # Check if test user already exists
    test_user = User.query.filter_by(email='test@example.com').first()
    
    if test_user:
        print("Test user already exists.")
    else:
        # Create a new test user
        new_user = User(
            email='test@example.com',
            first_name='Test',
            last_name='User'
        )
        new_user.set_password('password123')
        
        db.session.add(new_user)
        db.session.commit()
        
        print("Test user created successfully!")
        print(f"Email: test@example.com")
        print(f"Password: password123") 