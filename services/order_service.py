"""
Order Service
Handles order processing workflow
"""
from models.order_model import OrderModel
from models.payment_model import PaymentModel
from models.product_model import ProductModel
from services.notification import NotificationService

class OrderService:
    @staticmethod
    def place_order(user_id, cart_items, shipping_address, payment_method='COD'):
        """Complete order placement workflow"""
        # Calculate total
        total_amount = sum(float(item['price']) * int(item.get('quantity', 1)) for item in cart_items)
        
        # Prepare order items
        order_items = []
        for item in cart_items:
            order_items.append({
                'product_id': item.get('product_id', ''),
                'name': item['name'],
                'quantity': int(item.get('quantity', 1)),
                'price': float(item['price']),
                'image_url': item.get('image_url', ''),
                'customizations': item.get('customizations', {})
            })
        
        # Determine initial payment status
        initial_payment_status = 'Unpaid' if payment_method == 'COD' else 'Pending'
        
        # Create order
        order_id, order_db_id = OrderModel.create_order(
            user_id=user_id,
            items=order_items,
            total_amount=total_amount,
            shipping_address=shipping_address,
            payment_method=payment_method,
            payment_status=initial_payment_status
        )
        
        # Create payment record
        transaction_id, payment_id = PaymentModel.create_payment(
            order_id=order_id,
            amount=total_amount,
            payment_method=payment_method,
            payment_status=initial_payment_status
        )
        
        # Update product stock
        for item in order_items:
            if item.get('product_id'):
                ProductModel.update_stock(item['product_id'], item['quantity'])
        
        # Send notification
        try:
            NotificationService.send_order_status_update(user_id, order_id, 'Pending')
        except: pass
        
        return {
            'order_id': order_id,
            'transaction_id': transaction_id,
            'total_amount': total_amount
        }

    @staticmethod
    def verify_delivery(order_id, otp):
        """Verify delivery using OTP"""
        success, message = OrderModel.verify_delivery_otp(order_id, otp)
        if success:
            # Additional logic can go here (e.g., updating payment status to Success for COD)
            payment = PaymentModel.get_payment_by_order_id(order_id)
            if payment and payment['payment_method'] == 'COD':
                PaymentModel.update_payment_status(payment['transaction_id'], 'Success')
                OrderModel.update_order_payment_status(order_id, 'Success')
        return success, message
    
    @staticmethod
    def process_payment(order_id, payment_status='Success'):
        """Process payment and update order status"""
        payment = PaymentModel.get_payment_by_order_id(order_id)
        if not payment:
            return False
        
        # Update payment status
        PaymentModel.update_payment_status(
            payment['transaction_id'],
            payment_status
        )
        OrderModel.update_order_payment_status(order_id, payment_status)
        
        if payment_status == 'Success':
            # Update order to Processing
            OrderModel.update_order_status(order_id, 'Processing')
            
            # Send notification
            order = OrderModel.get_order_by_id(order_id)
            if order:
                NotificationService.send_payment_confirmation(
                    order['user_id'],
                    order_id,
                    payment['transaction_id'],
                    payment['amount']
                )
        
        return True
    
    @staticmethod
    def update_order_status(order_id, new_status, admin_id=None):
        """Update order status (admin function)"""
        order = OrderModel.get_order_by_id(order_id)
        if not order:
            return False
        
        # Update status
        OrderModel.update_order_status(order_id, new_status)
        
        # Send notification to customer
        NotificationService.send_order_status_update(
            order['user_id'],
            order_id,
            new_status
        )
        
        return True
