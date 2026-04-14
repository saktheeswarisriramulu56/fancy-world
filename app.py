# 🚀 Fancy World - Stable Backend (Render Safe)

import os
from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from datetime import datetime, timedelta
from functools import wraps
import random
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash, generate_password_hash
from bson import ObjectId
import razorpay

app = Flask(__name__)
app.secret_key = "fancy_secret_key"

# Razorpay Client Initialization
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET')
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)) if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET else None

# Ensure required folders exist (Production Safety)
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('static/images', exist_ok=True)
os.makedirs('static/uploads/custom', exist_ok=True)

@app.after_request
def add_header(response):
    if 'Cache-Control' not in response.headers:
        if request.path.startswith('/static/'):
            response.headers['Cache-Control'] = 'public, max-age=31536000'
        return response
    return response

@app.context_processor
def inject_global_data():
    count = 0
    if 'user_id' in session:
        user = users_collection.find_one({'_id': ObjectId(session['user_id'])}, {'cart': 1})
        if user and 'cart' in user: count = len(user['cart'])
    return dict(cart_count=count)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

# --- ROUTES ---

@app.route('/')
def home():
    return "Working ✅ Fancy World Backend Running!"

@app.route('/health')
def health():
    return {"status": "ok"}

# ---------- AUTH (TEMP) ----------

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.json
        session['user'] = data.get('email', 'guest')
        return jsonify({"status": "success"})
    return "Login Page"

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

# ---------- CART (TEMP) ----------

@app.route('/api/cart/add', methods=['POST'])
def add_cart():
    cart = session.get('cart', [])
    cart.append(request.json)
    session['cart'] = cart
    return jsonify({"status": "success", "count": len(cart)})

@app.route('/api/cart')
def get_cart():
    return jsonify(session.get('cart', []))

# ---------- PRODUCTS (TEMP STATIC DATA) ----------

@app.route('/api/create-razorpay-order', methods=['POST'])
@login_required
def create_razorpay_order():
    if not razorpay_client:
        return jsonify({'status': 'error', 'message': 'Razorpay not configured'}), 500
    
    data = request.json
    amount = int(float(data.get('amount')) * 100)  # Amount in paise
    
    try:
        order = razorpay_client.order.create({
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1
        })
        return jsonify({'status': 'success', 'order': order, 'key_id': RAZORPAY_KEY_ID})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/verify-payment', methods=['POST'])
@login_required
def verify_payment():
    if not razorpay_client:
        return jsonify({'status': 'error', 'message': 'Razorpay not configured'}), 500
        
    data = request.json
    try:
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': data['razorpay_order_id'],
            'razorpay_payment_id': data['razorpay_payment_id'],
            'razorpay_signature': data['razorpay_signature']
        })
        
        # Place order in DB after successful payment
        cart = session.get('cart', [])
        result = OrderService.place_order(
            user_id=session['user_id'],
            cart_items=cart,
            shipping_address=data.get('shipping_address'),
            payment_method='ONLINE'
        )
        session['cart'] = []
        return jsonify({'status': 'success', 'order_id': result['order_id']})
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'Payment verification failed'})

@app.route('/admin')
@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    if session.get('role') != 'admin': return redirect(url_for('home'))
    return render_template('admin_dashboard.html', 
                          all_products=ProductModel.get_all_products(),
                          all_orders=OrderModel.get_all_orders())

@app.route('/api/add_product', methods=['POST'])
@login_required
def api_add_product():
    if session.get('role') != 'admin': return jsonify({'status': 'error'}), 403
    name = request.form.get('name')
    category = request.form.get('category')
    price = request.form.get('price')
    image = request.files.get('image')
    
    image_url = '/static/images/default.png'
    if image:
        filename = secure_filename(image.filename)
        path = os.path.join('static/images', filename)
        image.save(path)
        image_url = f'/{path}'
        
    pid = ProductModel.create_product(name, category, price, 100, image_url)
    if image:
        features = get_image_features(os.path.join('static/images', filename))
        if features: ProductModel.update_features(pid, features)
        
    return jsonify({'status': 'success'})

@app.route('/catalog')
def catalog():
    return jsonify(DUMMY_PRODUCTS)

# ---------- IMAGE SEARCH (DISABLED SAFE) ----------

@app.route('/api/image-search', methods=['POST'])
def image_search():
    return jsonify({
        "status": "success",
        "message": "Image search disabled (free tier)",
        "products": DUMMY_PRODUCTS[:2]
    })

# ---------- ADMIN (TEMP) ----------

@app.route('/admin')
def admin():
    return "Admin Dashboard (Safe Mode)"

# ---------- RUN ----------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
