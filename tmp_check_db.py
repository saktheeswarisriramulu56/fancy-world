
import os
import sys
from bson import ObjectId

# Add current directory to path to import models and database
sys.path.append(os.getcwd())

from database.mongo import users_collection, orders_collection



def check_db():
    with open('db_debug.txt', 'w', encoding='utf-8') as f:
        f.write("--- START DEBUG ---\n")
        try:
            user_count = users_collection.count_documents({})
            order_count = orders_collection.count_documents({})
            
            f.write(f"USERS_COUNT: {user_count}\n")
            f.write(f"ORDERS_COUNT: {order_count}\n")
            
            if order_count > 0:
                for order in orders_collection.find().limit(5):
                    f.write(f"ORDER_ID: {order.get('order_id')}\n")
                    f.write(f"ORDER_USER_ID: {order.get('user_id')}\n")
                    f.write(f"ORDER_USER_ID_TYPE: {type(order.get('user_id'))}\n")
            
            if user_count > 0:
                for user in users_collection.find().limit(5):
                    f.write(f"USER_ID: {user.get('_id')}\n")
                    f.write(f"USER_ID_TYPE: {type(user.get('_id'))}\n")
                    f.write(f"USER_EMAIL: {user.get('email')}\n")
        except Exception as e:
            f.write(f"ERROR: {e}\n")
        f.write("--- END DEBUG ---\n")
    print("Debug info written to db_debug.txt")



if __name__ == "__main__":
    check_db()
