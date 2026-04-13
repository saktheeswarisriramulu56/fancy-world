import os
import sys

# Add project root to path
sys.path.append(os.getcwd())

from database.mongo import db, products_collection
from services.cnn_search import get_image_features
from models.product_model import ProductModel
from bson import ObjectId

def run_fix_indexing():
    print("🚀 Starting FORCE AI Feature Indexing...")
    
    # 1. Fetch all products
    products = list(products_collection.find({}))
    print(f"Total products found: {len(products)}")
    
    count = 0
    updated = 0
    
    for p in products:
        count += 1
        name = p.get('name', 'Unknown Product')
        image_url = p.get('image_url', '')
        
        if not image_url:
            print(f"[{count}/{len(products)}] Skipping {name}: No image URL.")
            continue
            
        # Clean path: handles both windows/unix slashes and leading/trailing spaces/slashes
        clean_path = image_url.strip().lstrip('/').replace('/', os.sep)
        img_path = os.path.join(os.getcwd(), clean_path)
        
        if os.path.exists(img_path):
            print(f"[{count}/{len(products)}] Processing {name} ({img_path})...")
            features = get_image_features(img_path)
            if features is not None:
                # Store as list of floats
                feat_list = features.tolist() if hasattr(features, 'tolist') else list(features)
                products_collection.update_one(
                    {'_id': p['_id']},
                    {'$set': {'cnn_features': feat_list}}
                )
                updated += 1
                print(f"   ✅ Saved {len(feat_list)} floats.")
            else:
                print(f"   ❌ Feature extraction failed.")
        else:
            print(f"   ⚠️ File not found: {img_path}")
            
    print(f"\n✅ COMPLETE: {updated} products indexed correctly.")

if __name__ == "__main__":
    run_fix_indexing()
