# LOHITH — Creative Portfolio (Flask)

This repository is a scaffold for a premium 3D creative portfolio website built with Flask.

Features included:
- 3D hero using Three.js (simplified)
- Floating chat / inquiry system with backend storage
- Admin dashboard (protected) for managing inquiries and projects
- Portfolio CRUD endpoints (add from admin)
- SQLite initial database + init script
- Security basics: CSRF, password hashing, protected routes
- SEO meta tags and responsive design base

Quickstart (local):
1. Create a Python virtual environment and activate it
   python -m venv venv
   source venv/bin/activate  # macOS / Linux
   venv\Scripts\activate     # Windows

2. Install dependencies
   pip install -r requirements.txt

3. Copy .env.example to .env and edit values

4. Initialize the database and create an admin user
   python database/init_db.py

5. Run locally
   python app.py

6. Open http://127.0.0.1:5000

Notes:
- Replace placeholder images and videos in static/images and static/videos
- Integrate real social links in templates/base.html
- For production, set DEBUG=False and configure a proper WSGI server (gunicorn)
