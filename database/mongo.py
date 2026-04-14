from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI")

try:
    if MONGO_URI:
        client = MongoClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
        db = client.get_database("fancy_world")
        print("✅ MongoDB Atlas Connected")
    else:
        raise Exception("No URI")

except Exception as e:
    print("⚠️ MongoDB disabled:", e)
    client = None
    db = None

# Safe collections
users_collection = db.users if db else None
products_collection = db.products if db else None
orders_collection = db.orders if db else None
admins_collection = db.admins if db else None
custom_requests_collection = db.custom_requests if db else None
