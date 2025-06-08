from app import create_app
from app.models.user import User

app = create_app()

with app.app_context():
    users = User.query.all()
    if users:
        print(f"Found {len(users)} users:")
        for user in users:
            print(f"ID: {user.id}, Email: {user.email}")
    else:
        print("No users found in the database.") 