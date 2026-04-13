"""
Custom Request Model for MongoDB
Handles customer customization requests
"""
from database.mongo import custom_requests_collection
from datetime import datetime
from bson import ObjectId

class CustomRequestModel:
    @staticmethod
    def create_request(user_id, description, image_url=None):
        """Create a new customization request from a customer"""
        request_data = {
            'user_id': user_id,
            'description': description,
            'image_url': image_url,
            'status': 'Pending',  # Pending, Possible, Not Possible
            'admin_messages': [], # List of admin responses
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = custom_requests_collection.insert_one(request_data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_user_requests(user_id):
        """Get all customization requests for a specific user"""
        return list(custom_requests_collection.find({'user_id': user_id}).sort('created_at', -1))
    
    @staticmethod
    def get_request_by_id(request_id):
        """Get a single request by ID"""
        return custom_requests_collection.find_one({'_id': ObjectId(request_id)})
    
    @staticmethod
    def get_all_requests():
        """Get all requests for the admin dashboard"""
        return list(custom_requests_collection.find().sort('created_at', -1))
    
    @staticmethod
    def admin_reply(request_id, status, message):
        """Admin reply to a customization request"""
        reply_data = {
            'sender': 'Admin',
            'message': message,
            'timestamp': datetime.utcnow()
        }
        
        return custom_requests_collection.update_one(
            {'_id': ObjectId(request_id)},
            {
                '$set': {
                    'status': status,
                    'updated_at': datetime.utcnow()
                },
                '$push': {
                    'admin_messages': reply_data
                }
            }
        )

    @staticmethod
    def get_pending_count():
        """Get count of pending requests for admin notification"""
        return custom_requests_collection.count_documents({'status': 'Pending'})
