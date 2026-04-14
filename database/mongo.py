from pymongo import MongoClient
import os
import logging

logger = logging.getLogger(__name__)
MONGODB_URI = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")

db = None
client = None
users_collection = None
products_collection = None
orders_collection = None
admins_collection = None
custom_requests_collection = None
payments_collection = None

try:
    if not MONGODB_URI:
        raise ValueError("MONGODB_URI environment variable is not set")

    client = MongoClient(
        MONGODB_URI,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000,
        socketTimeoutMS=10000,
        tls=True,
        tlsAllowInvalidCertificates=True
    )
    # Force connection test
    client.admin.command('ping')
    
    DATABASE_NAME = os.getenv("DATABASE_NAME", "fancyworld")
    db = client[DATABASE_NAME]

    users_collection = db.users
    products_collection = db.products
    orders_collection = db.orders
    admins_collection = db.admins
    custom_requests_collection = db.custom_requests
    payments_collection = db.payments

    logger.info(f"[SUCCESS] Connected to MongoDB: {DATABASE_NAME}")
except Exception as e:
    logger.error(f"[WARNING] MongoDB connection failed: {e}")
    logger.info("[INFO] App will run in limited mode (no database features)")
    db = None
    client = None
    users_collection = None
    products_collection = None
    orders_collection = None
    admins_collection = None
    custom_requests_collection = None
    payments_collection = None
