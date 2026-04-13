"""
MongoDB Connection Setup for Fancy World
Connects to MongoDB Atlas (Cloud Database)
"""
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import os
from datetime import datetime

# MongoDB Atlas Connection String
# Replace with your actual MongoDB Atlas connection string
# Format: mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'fancyworld')

try:
    # Connect to MongoDB
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Test connection
    client.server_info()
    print(f"[SUCCESS] Connected to MongoDB: {DATABASE_NAME}")
except (ConnectionFailure, ServerSelectionTimeoutError) as e:
    print(f"[ERROR] MongoDB connection failed: {e}")
    print("[WARNING] Using local MongoDB or check your MongoDB Atlas connection string")
    client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)

# Get database
db = client[DATABASE_NAME]

# Collections
users_collection = db['users']
products_collection = db['products']
orders_collection = db['orders']
payments_collection = db['payments']
admins_collection = db['admins']
custom_requests_collection = db['custom_requests']


def get_db():
    """Get database instance"""
    return db

def get_collection(collection_name):
    """Get a specific collection"""
    return db[collection_name]

def create_indexes():
    """Create indexes for better query performance"""
    try:
        # Users indexes
        users_collection.create_index("email", unique=True)
        users_collection.create_index("username", unique=True)
        users_collection.create_index("phone", unique=True, sparse=True)
        
        # Products indexes
        products_collection.create_index("name")
        products_collection.create_index("category")
        products_collection.create_index([("name", "text"), ("category", "text")])  # Text search
        
        # Orders indexes
        orders_collection.create_index("user_id")
        orders_collection.create_index("order_id", unique=True)
        orders_collection.create_index("status")
        orders_collection.create_index("created_at")
        
        # Payments indexes
        payments_collection.create_index("order_id")
        payments_collection.create_index("transaction_id", unique=True)

        # Custom Requests indexes
        custom_requests_collection.create_index("user_id")
        custom_requests_collection.create_index("status")
        custom_requests_collection.create_index("created_at")

        
        print("[SUCCESS] Database indexes created successfully")
    except Exception as e:
        print(f"[WARNING] Index creation warning: {e}")

# Initialize indexes on import
create_indexes()
