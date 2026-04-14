# 🚀 Jewelry E-Commerce Backend (SAFE MODE - No Mongo, No ML)

import os
from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from functools import wraps
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash

# ❌ Mongo disabled
db = None
users_collection = None
products_collection = None
orders_collection = None
admins_collection = None
custom_requests_collection = None

# ❌ ML disabled
# from services.cnn_search import search_products_by_image

app = Flask(__name__)
app.secret_key = "test_key"

app.config['UPLOAD_FOLDER'] = 'static/images/uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('static/images', exist_ok=True)
os.makedirs('static/uploads/custom', exist_ok=True)

# ---------- BASIC ROUTES ----------

@app.route('/')
def home():
    return "App is running 🚀"

@app.route('/login')
def login():
    return "Login Page"

@app.route('/register')
def register():
    return "Register Page"

@app.route('/catalog')
def catalog():
    return "Catalog Page"

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
        "message": "Image search disabled",
        "products": []
    })

# ---------- ADMIN ----------
@app.route('/admin')
def admin():
    return "Admin Dashboard"

# ---------- RUN ----------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
