# 🚀 Fancy World - Stable Backend (Render Safe)

import os
from flask import Flask, request, jsonify, session, redirect, url_for

app = Flask(__name__)
app.secret_key = "fancy_secret_key"

# ---------- BASIC ROUTES ----------

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

DUMMY_PRODUCTS = [
    {"id": 1, "name": "Gold Ring", "price": 5000},
    {"id": 2, "name": "Silver Chain", "price": 2000},
    {"id": 3, "name": "Diamond Necklace", "price": 15000},
]

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
