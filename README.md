<<<<<<< HEAD
# fancy-world
Online ecommerce website for bangles, fancy items, and fashion accessories
=======
# Fancy World - E-Commerce Application

A complete, real-time e-commerce platform for jewelry and accessories with CNN-based image search, MongoDB Atlas integration, and comprehensive admin dashboard.

## 🌟 Features

### Customer Features
- ✅ User registration and login
- ✅ Profile management
- ✅ Product browsing by category
- ✅ Add to cart and checkout
- ✅ Secure payment processing (UPI/Card/Wallet)
- ✅ Order history view
- ✅ Real-time order tracking (Placed → Processing → Shipped → Delivered)
- ✅ Notifications for order status updates
- ✅ CNN-based smart image search

### Admin Features
- ✅ Secure admin login
- ✅ View all customer orders
- ✅ Edit product details (name, price, stock, images)
- ✅ Update order status
- ✅ Manage customers
- ✅ Monitor payments and transactions
- ✅ View analytics and sales reports

### Technical Features
- ✅ MongoDB Atlas (Cloud Database) - Real-time data storage
- ✅ CNN-based product image classification
- ✅ RESTful API architecture
- ✅ Mobile-first responsive design
- ✅ Real-time order tracking

## 📁 Project Structure

```
fancy-world/
│
├── app.py                  # Main Flask application
├── requirements.txt         # Python dependencies
├── config.py               # Configuration settings
├── README.md               # Project documentation
│
├── database/
│   └── mongo.py            # MongoDB connection setup
│
├── models/                 # Data models
│   ├── user_model.py       # User schema and operations
│   ├── product_model.py     # Product data handling
│   ├── order_model.py       # Order & tracking logic
│   └── payment_model.py     # Payment transactions
│
├── services/               # Business logic
│   ├── order_service.py    # Order processing workflow
│   ├── notification.py    # Order status notifications
│   └── cnn_search.py       # CNN image search service
│
├── backend/
│   └── utils/
│       └── cnn_engine.py   # CNN model architecture
│
├── static/
│   ├── css/
│   │   └── style.css       # UI styles
│   ├── js/
│   │   └── main.js         # Frontend JavaScript
│   └── images/             # Product images
│
└── templates/
    ├── home.html           # Home page (mobile-first)
    ├── login.html          # Login page
    ├── register.html       # Registration page
    ├── profile.html        # Customer profile + orders
    ├── cart.html           # Shopping cart
    └── admin_dashboard.html # Admin panel
```

## 🚀 Setup Instructions

### 1. Prerequisites
- Python 3.8+
- MongoDB Atlas account (or local MongoDB)
- pip package manager

### 2. Install Dependencies

**Option A: Using setup script (Recommended)**
```bash
python setup.py
```

**Option B: Manual installation**
```bash
pip install -r requirements.txt
```

**Option C: Install individual packages if needed**
```bash
pip install Flask pymongo Werkzeug Pillow numpy python-dotenv
# TensorFlow is optional (for CNN features)
pip install tensorflow
```

**Note:** If you get `ModuleNotFoundError: No module named 'PIL'`, install Pillow:
```bash
pip install Pillow
```

### 3. MongoDB Setup

#### Option A: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Set environment variable:
   ```bash
   export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/"
   export DATABASE_NAME="fancyworld"
   ```

#### Option B: Local MongoDB
```bash
# Install MongoDB locally
# Then use default connection: mongodb://localhost:27017/
```

### 4. Environment Variables

Create a `.env` file (optional):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DATABASE_NAME=fancyworld
SECRET_KEY=your_secret_key_here
```

### 5. Run the Application

```bash
python app.py
```

The app will run on `http://127.0.0.1:5000`

### 6. Default Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

**Customer:**
- Register a new account via `/register`

## 🔧 Configuration

### MongoDB Connection
Edit `database/mongo.py` to update connection settings:
```python
MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'fancyworld')
```

### CNN Model
Place your trained CNN model at:
```
ai_models/jewellery_cnn.h5
```

If model is not found, the system will use simulation mode.

## 📱 API Endpoints

### Customer APIs
- `POST /api/add_to_cart` - Add product to cart
- `POST /api/checkout` - Place order
- `POST /api/process_payment` - Process payment
- `POST /api/search` - Text-based product search
- `POST /api/image-search` - CNN-based image search
- `GET /api/order/<order_id>` - Get order details

### Admin APIs
- `POST /api/add_product` - Add new product
- `POST /api/update_product/<id>` - Update product
- `POST /api/delete_product/<id>` - Delete product
- `POST /api/update_order_status` - Update order status

## 🧠 CNN Image Search

The application includes a CNN-based image classification system:

1. Customer uploads/captures product image
2. CNN analyzes the image
3. System displays:
   - Exact product matches
   - Visually similar products
   - Category recommendations

## 💳 Payment Integration

Currently supports simulated payment processing. To integrate real payment gateways:

1. Update `services/order_service.py`
2. Add payment gateway SDK (Razorpay, Stripe, etc.)
3. Update `models/payment_model.py` with gateway-specific fields

## 📊 Order Tracking

Orders progress through these statuses:
1. **Placed** - Order received
2. **Processing** - Payment confirmed, preparing order
3. **Shipped** - Order dispatched
4. **Delivered** - Order completed

Each status change triggers a notification to the customer.

## 🚢 Deployment

### Deploy to Production

1. Set environment variables on your hosting platform
2. Update `MONGODB_URI` with production connection string
3. Set `SECRET_KEY` to a secure random string
4. Configure static file serving
5. Set up SSL/HTTPS

### Recommended Platforms
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Platform
- DigitalOcean App Platform

## 🔍 Google Search Indexing

To make your site searchable on Google:

1. Deploy to a public server
2. Submit sitemap to Google Search Console
3. Add meta tags for SEO
4. Ensure mobile-responsive design

## 📝 License

This project is for educational/demonstration purposes.

## 🤝 Support

For issues or questions, please check the documentation or create an issue.

---

**Built with Flask, MongoDB, TensorFlow, and ❤️**
>>>>>>> 5581489c (Initial commit: added project files)
