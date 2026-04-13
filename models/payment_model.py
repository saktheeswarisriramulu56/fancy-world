"""
Payment Model for MongoDB
Handles payment transactions
"""
from database.mongo import payments_collection
from datetime import datetime
from bson import ObjectId
import random
import string

class PaymentModel:
    @staticmethod
    def generate_transaction_id():
        """Generate unique transaction ID"""
        return f"TXN{''.join(random.choices(string.ascii_uppercase + string.digits, k=12))}"
    
    @staticmethod
    def create_payment(order_id, amount, payment_method='COD', payment_status='Unpaid'):
        """Create a payment record"""
        transaction_id = PaymentModel.generate_transaction_id()
        
        payment_data = {
            'transaction_id': transaction_id,
            'order_id': order_id,
            'amount': float(amount),
            'payment_method': payment_method,  # UPI, Card, Wallet
            'payment_status': payment_status,  # Pending, Success, Failed, Refunded
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = payments_collection.insert_one(payment_data)
        return transaction_id, str(result.inserted_id)
    
    @staticmethod
    def get_payment_by_order_id(order_id):
        """Get payment by order ID"""
        return payments_collection.find_one({'order_id': order_id})
    
    @staticmethod
    def get_payment_by_transaction_id(transaction_id):
        """Get payment by transaction ID"""
        return payments_collection.find_one({'transaction_id': transaction_id})
    
    @staticmethod
    def update_payment_status(transaction_id, status, payment_details=None):
        """Update payment status"""
        update_data = {
            'payment_status': status,
            'updated_at': datetime.utcnow()
        }
        
        if payment_details:
            update_data['payment_details'] = payment_details
        
        return payments_collection.update_one(
            {'transaction_id': transaction_id},
            {'$set': update_data}
        )
    
    @staticmethod
    def get_all_payments():
        """Get all payments (for admin)"""
        return list(payments_collection.find({}).sort('created_at', -1))
