from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import CSRFProtect
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config
import os
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)
csrf = CSRFProtect(app)
mail = Mail(app)
login_manager = LoginManager(app)
login_manager.login_view = 'admin_login'

from models.models import User, Inquiry, PortfolioProject

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- Public routes ---
@app.route('/')
def index():
    projects = PortfolioProject.query.order_by(PortfolioProject.created_at.desc()).limit(9).all()
    return render_template('index.html', projects=projects)

@app.route('/portfolio')
def portfolio():
    projects = PortfolioProject.query.order_by(PortfolioProject.created_at.desc()).all()
    categories = ['ALL', 'THUMBNAILS', 'VIDEO EDITING', 'BANNERS', 'LOGOS', 'INSTAGRAM']
    return render_template('portfolio.html', projects=projects, categories=categories)

@app.route('/project/<int:project_id>')
def project_detail(project_id):
    p = PortfolioProject.query.get_or_404(project_id)
    return render_template('project.html', project=p)

# Inquiry endpoint used by chat form and contact form
@app.route('/inquiry', methods=['POST'])
def inquiry():
    data = request.get_json() or request.form
    name = data.get('name')
    email = data.get('email')
    service = data.get('service')
    message = data.get('message')
    budget = data.get('budget')
    deadline = data.get('deadline')

    if not name or not email or not service or not message:
        return jsonify({'success': False, 'error': 'Missing required fields'}), 400

    iq = Inquiry(name=name, email=email, service=service, message=message, budget=budget, deadline=deadline)
    db.session.add(iq)
    db.session.commit()

    # Optionally send mail
    if app.config.get('MAIL_USERNAME') and app.config.get('MAIL_PASSWORD'):
        try:
            msg = Message(subject=f'New Inquiry: {service}', recipients=[app.config.get('ADMIN_EMAIL')], body=f"Name: {name}\nEmail: {email}\nService: {service}\nBudget: {budget}\nDeadline: {deadline}\n\nMessage:\n{message}")
            mail.send(msg)
        except Exception as e:
            app.logger.warning('Mail send failed: %s', e)

    return jsonify({'success': True, 'message': 'Your request was submitted.'})

# --- Admin routes ---
@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            return redirect(url_for('admin_dashboard'))
        flash('Invalid credentials', 'danger')
    return render_template('admin_login.html')

@app.route('/admin/logout')
@login_required
def admin_logout():
    logout_user()
    return redirect(url_for('admin_login'))

@app.route('/admin')
@login_required
def admin_dashboard():
    inquiries = Inquiry.query.order_by(Inquiry.created_at.desc()).all()
    projects = PortfolioProject.query.order_by(PortfolioProject.created_at.desc()).all()
    return render_template('admin.html', inquiries=inquiries, projects=projects)

@app.route('/admin/project/add', methods=['POST'])
@login_required
def admin_add_project():
    title = request.form.get('title')
    category = request.form.get('category')
    description = request.form.get('description')
    image = request.form.get('image')
    video = request.form.get('video')
    project_url = request.form.get('project_url')

    if not title or not category:
        flash('Title and category are required', 'danger')
        return redirect(url_for('admin_dashboard'))

    p = PortfolioProject(title=title, category=category, description=description, image=image, video=video, project_url=project_url)
    db.session.add(p)
    db.session.commit()
    flash('Project added', 'success')
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/inquiry/<int:inq_id>/mark', methods=['POST'])
@login_required
def admin_mark_inquiry(inq_id):
    s = request.form.get('status') or 'new'
    inq = Inquiry.query.get_or_404(inq_id)
    inq.status = s
    db.session.commit()
    return redirect(url_for('admin_dashboard'))

# Static simple health check
@app.route('/health')
def health():
    return 'OK'

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
