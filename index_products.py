import os
import sys

# Add project root to path
sys.path.append(os.getcwd())

from database.mongo import db
from services.cnn_search import index_all_products
from models.product_model import ProductModel

def run_indexing():
    """
    VIVA: Admin tools to re-calculate all product embeddings.
    Must be run after switching to the PyTorch ResNet50 engine.
    """
    print("--- Re-indexing Jewelry Products (PyTorch ResNet50 Engine) ---")
    
    # Check current status
    total = ProductModel.get_all_products(active_only=False)
    print(f"[*] Database contains {len(total)} products.")
    
    # ⚠️ We need to clear old TF features to ensure fresh indexing
    print("[WAIT] Clearing legacy TensorFlow feature vectors...")
    db.products.update_many({}, {"$set": {"cnn_features": None}})
    
    count = index_all_products()
    print(f"\n[SUCCESS] Indexed {count} products.")
    
    # Final check
    indexed_count = db.products.count_documents({'cnn_features': {'$ne': None}})
    print(f"[DONE] Total products with deep shape features: {indexed_count}")

if __name__ == "__main__":
    run_indexing()
