"""
User Model for MongoDB
Handles customer profile details
"""
from database.mongo import users_collection
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId

class UserModel:
    @staticmethod
    def create_user(username, email, password, phone=None, address=None, role='customer'):
        """Create a new user or upgrade a pending one"""
        user_data = {
            'username': username,
            'email': email.lower(),
            'password': generate_password_hash(password),
            'phone': phone,
            'address': address or {},
            'role': role,
            'updated_at': datetime.utcnow(),
            'is_active': True,
            'is_verified': True
        }
        
        try:
            # If phone exists, update it. Otherwise insert new.
            if phone:
                result = users_collection.update_one(
                    {'phone': phone},
                    {
                        '$set': user_data,
                        '$setOnInsert': {'created_at': datetime.utcnow()}
                    },
                    upsert=True
                )
                # If it was an update or insert
                user = users_collection.find_one({'phone': phone})
                return str(user['_id'])
            else:
                user_data['created_at'] = datetime.utcnow()
                result = users_collection.insert_one(user_data)
                return str(result.inserted_id)
        except Exception as e:
            if 'duplicate key' in str(e).lower():
                return None  # User already exists (email or username)
            raise e
    
    @staticmethod
    def get_user_by_email(email):
        """Get user by email"""
        return users_collection.find_one({'email': email.lower()})
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        return users_collection.find_one({'_id': ObjectId(user_id)})
    
    @staticmethod
    def get_user_by_username(username):
        """Get user by username"""
        return users_collection.find_one({'username': username})
    
    @staticmethod
    def get_user_by_phone(phone):
        """Get user by phone"""
        return users_collection.find_one({'phone': phone})
    
# OTP verification methods removed.
    
    @staticmethod
    def verify_password(user, password):
        """Verify user password"""
        return check_password_hash(user['password'], password)
    
    @staticmethod
    def update_profile(user_id, update_data):
        """Update user profile"""
        update_data['updated_at'] = datetime.utcnow()
        return users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
    
    @staticmethod
    def get_all_customers():
        """Get all customers (for admin)"""
        return list(users_collection.find({'role': 'customer'}))
