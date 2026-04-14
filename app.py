# 🚀 Jewelry E-Commerce Backend (MobileNetV3 Small)
import sys
import os
from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from datetime import datetime, timedelta
from functools import wraps
import random
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash, generate_password_hash
from bson import ObjectId
import razorpay
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Import MongoDB and Models
from database.mongo import db, users_collection, products_collection, orders_collection, admins_collection, custom_requests_collection
from services.cnn_search import search_products_by_image, get_image_features
from models.user_model import UserModel
from models.product_model import ProductModel
from models.order_model import OrderModel
from services.order_service import OrderService
from models.custom_request_model import CustomRequestModel

# --- CORE FLASK INITIALIZATION ---
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'fancy_world_key_2026')
app.config['UPLOAD_FOLDER'] = 'static/images/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['SESSION_PERMANENT'] = True

logger.info("Initializing Razorpay Client")
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET')
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)) if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET else None
if not razorpay_client:
    logger.warning("Razorpay keys not found in environment!")

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

@app.route('/health')
def health():
    return jsonify({"status": "ok", "message": "Fancy World running perfectly"}), 200

@app.route('/')
@app.route('/home')
def home():
    featured_products = ProductModel.get_all_products(active_only=True)[:8]
    return render_template('index.html', products=featured_products)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        is_admin = request.form.get('is_admin') == 'true'
        
        if is_admin:
            admin = admins_collection.find_one({'username': email})
            if admin and check_password_hash(admin['password'], password):
                session['user_id'] = str(admin['_id'])
                session['username'] = admin['username']
                session['role'] = 'admin'
                return redirect(url_for('admin_dashboard'))
        else:
            user = UserModel.get_user_by_email(email)
            if user and check_password_hash(user['password'], password):
                session['user_id'] = str(user['_id'])
                session['username'] = user['username']
                session['role'] = 'customer'
                return redirect(url_for('home'))
        
        flash("Invalid credentials", "error")
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        phone = request.form.get('phone')
        
        if UserModel.get_user_by_email(email) or UserModel.get_user_by_username(username):
            flash("User already exists", "error")
            return render_template('register.html')
            
        user_id = UserModel.create_user(username, email, password, phone)
        if user_id:
            session['user_id'] = str(user_id)
            session['username'] = username
            session['role'] = 'customer'
            return redirect(url_for('home'))
            
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    if 'user_id' not in session: return jsonify({'status': 'error'}), 401
    data = request.json
    cart = session.get('cart', [])
    cart.append(data)
    session['cart'] = cart
    return jsonify({'status': 'success', 'count': len(cart)})

@app.route('/api/checkout', methods=['POST'])
@login_required
def checkout():
    cart = session.get('cart', [])
    if not cart: return jsonify({'status': 'error', 'message': 'Cart empty'}), 400
    data = request.json
    result = OrderService.place_order(
        user_id=session['user_id'],
        cart_items=cart,
        shipping_address=data.get('shipping_address'),
        payment_method='COD'
    )
    session['cart'] = []
    return jsonify({'status': 'success', 'order_id': result[0]})

@app.route('/api/image-search', methods=['POST'])
def api_image_search():
    if 'image' not in request.files: return jsonify({'status': 'error'}), 400
    file = request.files['image']
    result = search_products_by_image(file)
    return jsonify(result)

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
    cat = request.args.get('category')
    if cat: products = ProductModel.get_products_by_category(cat)
    else: products = ProductModel.get_all_products()
    return render_template('catalog.html', products=products)

@app.route('/api/custom-request', methods=['POST'])
@login_required
def api_custom_request():
    desc = request.form.get('description')
    image = request.files.get('image')
    img_url = None
    if image:
        fname = secure_filename(image.filename)
        path = os.path.join('static/uploads/custom', f"{session['user_id']}_{fname}")
        image.save(path)
        img_url = f'/{path}'
    
    CustomRequestModel.create_request(session['user_id'], desc, img_url)
    return jsonify({'success': True})

@app.route('/admin/custom-requests')
@login_required
def admin_custom_requests():
    if session.get('role') != 'admin': return redirect(url_for('home'))
    requests = CustomRequestModel.get_all_requests()
    return render_template('admin_custom_requests.html', requests=requests)

@app.route('/api/admin/reply-request', methods=['POST'])
@login_required
def api_admin_reply_request():
    if session.get('role') != 'admin': return jsonify({'success': False}), 403
    data = request.json
    rid = data.get('request_id')
    status = data.get('status')
    msg = data.get('message')
    
    req = CustomRequestModel.get_request_by_id(rid)
    if req:
        CustomRequestModel.admin_reply(rid, status, msg)
        from services.notification import NotificationService
        NotificationService.notify_custom_request_update(req['user_id'], rid, status, msg)
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Request not found'}), 404

@app.route('/api/notifications')
@login_required
def get_notifications():
    from database.mongo import db
    notes = list(db.notifications.find({'user_id': ObjectId(session['user_id'])}).sort('created_at', -1).limit(10))
    for n in notes: n['_id'] = str(n['_id']); n['user_id'] = str(n['user_id'])
    return jsonify(notes)

# --- ADMIN BULK TOOL ---
@app.route('/api/admin/bulk-index', methods=['POST'])
def api_admin_bulk_index():
    if session.get('role') != 'admin': return jsonify({'status': 'error'}), 403
    from services.cnn_search import index_all_products
    count = index_all_products()
    return jsonify({'status': 'success', 'count': count})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    logger.info(f"Starting server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
