"""
Order Model for MongoDB
Handles order placement and tracking
"""
from database.mongo import orders_collection
from datetime import datetime
from bson import ObjectId
import random

class OrderModel:
    @staticmethod
    def create_order(user_id, items, total_amount, shipping_address, payment_method='COD', payment_status='Unpaid'):
        """Create a new order"""
        order_id = f"FW-{datetime.now().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
        
        order_data = {
            'order_id': order_id,
            'user_id': str(user_id), 
            'items': items,
            'total_amount': float(total_amount),
            'shipping_address': shipping_address,
            'payment_method': payment_method,
            'payment_status': payment_status, 
            'status': 'Pending',
            'status_history': [
                {
                    'status': 'Pending',
                    'timestamp': datetime.utcnow(),
                    'message': f'Order initiated using {payment_method}'
                }
            ],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = orders_collection.insert_one(order_data)
        return order_id, str(result.inserted_id)
    
# Delivery OTP verification removed.
    
    @staticmethod
    def get_order_by_id(order_id):
        """Get order by order_id"""
        return orders_collection.find_one({'order_id': order_id})
    
    @staticmethod
    def get_orders_by_user(user_id):
        """Get all orders for a user, handling both string and ObjectId types"""
        user_id_str = str(user_id)
        query = {
            '$or': [
                {'user_id': user_id_str},
                {'user_id': ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id}
            ]
        }
        return list(orders_collection.find(query).sort('created_at', -1))
    
    @staticmethod
    def get_all_orders():
        """Get all orders (for admin)"""
        return list(orders_collection.find({}).sort('created_at', -1))
    
    @staticmethod
    def update_order_status(order_id, new_status, message=None):
        """Update order status with history tracking"""
        order = orders_collection.find_one({'order_id': order_id})
        if not order:
            return False
        
        status_messages = {
            'Placed': 'Order placed successfully',
            'Processing': 'Your order is being processed',
            'Shipped': 'Your order has been shipped',
            'Delivered': 'Your order has been delivered',
            'Cancelled': 'Order has been cancelled'
        }
        
        status_history = order.get('status_history', [])
        status_history.append({
            'status': new_status,
            'timestamp': datetime.utcnow(),
            'message': message or status_messages.get(new_status, 'Status updated')
        })
        
        orders_collection.update_one(
            {'order_id': order_id},
            {
                '$set': {
                    'status': new_status,
                    'status_history': status_history,
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        return True
    
    @staticmethod
    def update_order_payment_status(order_id, payment_status):
        """Update payment status in order document"""
        orders_collection.update_one(
            {'order_id': order_id},
            {'$set': {'payment_status': payment_status, 'updated_at': datetime.utcnow()}}
        )
        
        return True


    @staticmethod
    def get_orders_by_status(status):

        """Get orders by status"""
        return list(orders_collection.find({'status': status}).sort('created_at', -1))
