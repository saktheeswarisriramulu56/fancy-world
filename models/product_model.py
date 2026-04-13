"""
Product Model for MongoDB
Handles product data operations
"""
from database.mongo import products_collection
from datetime import datetime
from bson import ObjectId

class ProductModel:
    @staticmethod
    def create_product(name, category, price, stock_quantity, image_url, description=None, material=None):
        """Create a new product"""
        product_data = {
            'name': name,
            'category': category,
            'price': float(price),
            'stock_quantity': int(stock_quantity),
            'image_url': image_url,
            'description': description or '',
            'material': material or 'Mixed',
            'cnn_features': None,  # AI-based feature vectors
            'total_sold': 0,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'is_active': True
        }
        
        result = products_collection.insert_one(product_data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_product_by_id(product_id):
        """Get product by ID"""
        return products_collection.find_one({'_id': ObjectId(product_id)})
    
    @staticmethod
    def get_all_products(active_only=True):
        """Get all products"""
        query = {'is_active': True} if active_only else {}
        return list(products_collection.find(query).sort('created_at', -1))
    
    @staticmethod
    def get_products_by_category(category):
        """Get products by category (case-insensitive)"""
        return list(products_collection.find({
            'category': {'$regex': f'^{category}$', '$options': 'i'},
            'is_active': True
        }))
    
    @staticmethod
    def search_products(query_text):
        """Search products by name or category"""
        return list(products_collection.find({
            '$or': [
                {'name': {'$regex': query_text, '$options': 'i'}},
                {'category': {'$regex': query_text, '$options': 'i'}},
                {'description': {'$regex': query_text, '$options': 'i'}}
            ],
            'is_active': True
        }))
    
    @staticmethod
    def update_features(product_id, features):
        """Update product image feature vectors"""
        return products_collection.update_one(
            {'_id': ObjectId(product_id)},
            {'$set': {'cnn_features': features.tolist() if hasattr(features, 'tolist') else features}}
        )

    @staticmethod
    def update_product(product_id, update_data):
        """Update product details"""
        update_data['updated_at'] = datetime.utcnow()
        return products_collection.update_one(
            {'_id': ObjectId(product_id)},
            {'$set': update_data}
        )
    
    @staticmethod
    def delete_product(product_id):
        """Soft delete product"""
        return products_collection.update_one(
            {'_id': ObjectId(product_id)},
            {'$set': {'is_active': False, 'updated_at': datetime.utcnow()}}
        )
    
    @staticmethod
    def update_stock(product_id, quantity_sold):
        """Update product stock after order"""
        product = products_collection.find_one({'_id': ObjectId(product_id)})
        if product:
            new_stock = max(0, product['stock_quantity'] - quantity_sold)
            products_collection.update_one(
                {'_id': ObjectId(product_id)},
                {
                    '$set': {
                        'stock_quantity': new_stock,
                        'total_sold': product.get('total_sold', 0) + quantity_sold,
                        'updated_at': datetime.utcnow()
                    }
                }
            )
    
    @staticmethod
    def get_trending_products(limit=10):
        """Get trending products by sales"""
        return list(products_collection.find({
            'is_active': True
        }).sort('total_sold', -1).limit(limit))
