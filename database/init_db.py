"""Small script to initialize the database and create an admin user.
Usage: python database/init_db.py
"""
import os
from getpass import getpass
from app import app, db
from models.models import User

os.makedirs(os.path.join(os.path.dirname(__file__)), exist_ok=True)

with app.app_context():
    db.create_all()
    print('Database created (if not exists)')

    admin_email = input('Admin email: ').strip()
    if not admin_email:
        print('No email provided; skipping admin user creation')
    else:
        existing = User.query.filter_by(email=admin_email).first()
        if existing:
            print('Admin user already exists')
        else:
            pw = getpass('Password for admin: ')
            user = User(email=admin_email)
            user.set_password(pw)
            db.session.add(user)
            db.session.commit()
            print('Admin user created')
