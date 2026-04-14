"""
Temporary Image Search (ML disabled for Render free tier)
"""

# ❌ Removed torch / torchvision بالكامل

from PIL import Image
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from models.product_model import ProductModel

# Disable ML
HAS_ML = False


def get_image_features(image_file):
    """Dummy features (ML disabled)."""
    return None


def search_products_by_image(image_file):
    """Fallback search without ML."""
    try:
        products = ProductModel.get_all_products(active_only=True)
        
        # Just return first 5 products (temporary)
        results = []
        for p in products[:5]:
            results.append({
                'id': str(p['_id']),
                'name': p['name'],
                'category': p['category'],
                'price': p['price'],
                'image_url': p.get('image_url', ''),
                'confidence': 0
            })

        return {
            'status': 'success',
            'message': 'ML disabled (Render free tier)',
            'products': results
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}


def index_all_products():
    return 0
