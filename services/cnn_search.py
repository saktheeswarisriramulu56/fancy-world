"""
Image Search Service - Render Safe Version
No PyTorch, No Torchvision, No ML crashes
"""

import numpy as np
from models.product_model import ProductModel
from sklearn.metrics.pairwise import cosine_similarity

MODEL_NAME = "Render_Safe_Similarity_Engine"
HAS_ML = False


# ==============================
# FEATURE EXTRACTION (DISABLED)
# ==============================

def get_image_features(image_file):
    """
    ML disabled for Render stability.
    Returns None safely.
    """
    return None


# ==============================
# IMAGE SEARCH (SAFE MODE)
# ==============================

def search_products_by_image(image_file):
    """
    Safe fallback image search using category grouping.
    """

    try:
        products = ProductModel.get_all_products(active_only=True)

        if not products:
            return {"status": "success", "products": []}

        # Group by category
        categories = {}
        for p in products:
            cat = p.get("category", "general")
            categories.setdefault(cat, []).append(p)

        # pick best available category
        detected_category = list(categories.keys())[0]
        category_items = categories[detected_category]

        results = []

        for p in category_items[:5]:
            results.append({
                "id": str(p["_id"]),
                "name": p.get("name", ""),
                "category": p.get("category", ""),
                "price": p.get("price", 0),
                "image_url": p.get("image_url", ""),
                "confidence": 50.0
            })

        return {
            "status": "success",
            "detected_category": detected_category,
            "products": results
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


# ==============================
# INDEXING (SAFE)
# ==============================

def index_all_products():
    """
    No ML indexing in production safe mode.
    """

    products = ProductModel.get_all_products(active_only=False)

    print(f"[SAFE MODE] Skipping ML indexing. Products: {len(products)}")

    return len(products)
