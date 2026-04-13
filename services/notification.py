"""
Notification Service for Fancy World
Handles email alerts and in-app notifications for order updates and custom requests.
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from database.mongo import db
from datetime import datetime
from bson import ObjectId

class NotificationService:
    @staticmethod
    def send_email(to_email, subject, body):
        """Send a transactional email using SMTP (e.g., Gmail/SendGrid)."""
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', 587))
        smtp_user = os.getenv('SMTP_USER')
        smtp_pass = os.getenv('SMTP_PASS')

        if not smtp_user or not smtp_pass:
            print("[WARNING] SMTP credentials missing. Email not sent.")
            return False

        try:
            msg = MIMEMultipart()
            msg['From'] = smtp_user
            msg['To'] = to_email
            msg['Subject'] = f"Fancy World | {subject}"
            msg.attach(MIMEText(body, 'html'))

            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
            server.quit()
            return True
        except Exception as e:
            print(f"[ERROR] Email failed: {e}")
            return False

    @staticmethod
    def add_in_app_notification(user_id, title, message, link=None):
        """Store a notification in MongoDB for the user's dashboard."""
        try:
            notification = {
                'user_id': ObjectId(user_id),
                'title': title,
                'message': message,
                'link': link,
                'is_read': False,
                'created_at': datetime.utcnow()
            }
            db.notifications.insert_one(notification)
            return True
        except Exception as e:
            print(f"[ERROR] In-app notification failed: {e}")
            return False

    @staticmethod
    def notify_order_placed(user_id, order_id, total_amount):
        """Alert user on new order success (COD)."""
        title = "Order Placed Successfully"
        message = f"Your order #{order_id} for ₹{total_amount} has been received. We will process it shortly."
        NotificationService.add_in_app_notification(user_id, title, message, link=f"/orders/{order_id}")

    @staticmethod
    def send_order_status_update(user_id, order_id, new_status):
        """Alert customer that their order status has changed."""
        title = f"Order {new_status}"
        message = f"Your order #{order_id} is now: {new_status}."
        NotificationService.add_in_app_notification(user_id, title, message, link=f"/orders/{order_id}")
        
    @staticmethod
    def send_payment_confirmation(user_id, order_id, trans_id, amount):
        """Alert user that payment was received."""
        title = "Payment Successful"
        message = f"Payment of ₹{amount} received for order #{order_id}."
        NotificationService.add_in_app_notification(user_id, title, message, link=f"/orders/{order_id}")

    @staticmethod
    def notify_custom_request_update(user_id, request_id, status, admin_message):
        """Alert user when admin replies to their jewelry design request."""
        title = f"Custom Request Update: {status.upper()}"
        message = f"Admin has replied to your request: \"{admin_message}\""
        
        NotificationService.add_in_app_notification(user_id, title, message, link="/profile")
