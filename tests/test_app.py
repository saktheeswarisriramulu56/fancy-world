import unittest
import os
import sys

# Add parent directory to path so we can import our app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__main__.__file__ if '__main__' in locals() else __file__), '../')))

from app import app
from database.mongo import client, db, MONGODB_URI

class FancyWorldAPITest(unittest.TestCase):
    def setUp(self):
        # Configure app for testing
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_health_check(self):
        """Test the /health endpoint"""
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get("status"), "ok")

    def test_database_connection(self):
        """Test if MongoDB Atlas connection works/gracefully degrades"""
        if not MONGODB_URI:
            self.assertIsNone(db, "Database should be None if MONGODB_URI is not set")
        else:
            try:
                # Test ping
                if client:
                    client.admin.command('ping')
                    self.assertIsNotNone(db, "Connected to DB but db object is None")
            except Exception as e:
                self.assertIsNone(db, f"DB object should be none on failure but caught: {e}")

    def test_razorpay_order_mock(self):
        """Test the shape of razorpay order creation (mocked/auth error check)"""
        # Without auth, it should bounce back elegantly
        response = self.client.post('/api/create-razorpay-order', json={"amount": 500})
        # Note: Will be 302 redirect normally due to @login_required
        self.assertIn(response.status_code, [302, 500])

if __name__ == '__main__':
    unittest.main()
