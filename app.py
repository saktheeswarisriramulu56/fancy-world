# 🚀 Jewelry E-Commerce Backend (Render Safe Version - No ML)

import os
from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from functools import wraps
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash
from bson import ObjectId

# Mongo + Models
from database.mongo import db, users_collection, products_collection, orders_collection, admins_collection, custom_requests_collection
from models.user_model import UserModel
from models.product_model import ProductModel
from models.order_model import OrderModel
from services.order_service import OrderService
from models.custom_request_model import CustomRequestModel

# ❌ ML disabled
# from services.cnn_search import search_products_by_image

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'fancy_world_key_2026')

app.config['UPLOAD_FOLDER'] = 'static/images/uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('static/images', exist_ok=True)
os.makedirs('static/uploads/custom', exist_ok=True)

# ---------- HELPERS ----------
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# ---------- ROUTES ----------

@app.route('/')
def home():
    products = ProductModel.get_all_products(active_only=True)[:8]
    return render_template('index.html', products=products)

@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = UserModel.get_user_by_email(email)
        if user and check_password_hash(user['password'], password):
            session['user_id'] = str(user['_id'])
            session['username'] = user['username']
            return redirect('/')

        flash("Invalid login")

    return render_template('login.html')

@app.route('/register', methods=['GET','POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

        uid = UserModel.create_user(username, email, password)
        if uid:
            session['user_id'] = str(uid)
            return redirect('/')

    return render_template('register.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

@app.route('/catalog')
def catalog():
    products = ProductModel.get_all_products()
    return render_template('catalog.html', products=products)

# ---------- CART ----------
@app.route('/api/cart/add', methods=['POST'])
def add_cart():
    cart = session.get('cart', [])
    cart.append(request.json)
    session['cart'] = cart
    return jsonify({'status': 'ok'})

# ---------- IMAGE SEARCH (DISABLED) ----------
@app.route('/api/image-search', methods=['POST'])
def image_search():
    return jsonify({
        "status": "success",
        "message": "Image search disabled (free tier)",
        "products": ProductModel.get_all_products()[:5]
    })

# ---------- ADMIN ----------
@app.route('/admin')
@login_required
def admin():
    return render_template('admin_dashboard.html')

# ---------- RUN ----------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
