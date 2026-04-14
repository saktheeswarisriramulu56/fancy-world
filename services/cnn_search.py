"""
PyTorch-Based Image Search Service (MobileNetV3 Small Engine)
Optimized for Render Free Tier (Ultra-low RAM, <1s Inference)
No TensorFlow dependencies.
"""
import os
from PIL import Image
import numpy as np
from models.product_model import ProductModel
from bson import ObjectId

# 🔧 AI CONFIGURATION
MODEL_NAME = "MobileNetV3_Small"
FEATURE_DIM = 576 # MobileNetV3 Small avgpool output size

try:
    from sklearn.metrics.pairwise import cosine_similarity
    import torch
    import torch.nn as nn
    import torchvision.models as models
    import torchvision.transforms as transforms

    class FeatureExtractor(nn.Module):
        def __init__(self):
            super(FeatureExtractor, self).__init__()
            # Load pretrained MobileNetV3 Small
            mbv3 = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.IMAGENET1K_V1)
            # Remove the final classifier head
            self.feature_layer = mbv3.avgpool
            self.backbone = mbv3.features
            self.eval() 
            
            for param in self.parameters():
                param.requires_grad = False

        def forward(self, x):
            x = self.backbone(x)
            x = self.feature_layer(x)
            return x

    # 🧠 Initialize Model Once at Startup (CPU mode)
    device = torch.device("cpu")
    model = FeatureExtractor().to(device)
    
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    HAS_ML = True
    print(f"[SUCCESS] AI Engine {MODEL_NAME} loaded. RAM usage optimized for Render.")
except ImportError:
    print("[ERROR] AI Engine unavailable (Torch not verified).")
    HAS_ML = False
except Exception as e:
    print(f"[ERROR] AI Engine failed to load: {e}")
    HAS_ML = False

def get_image_features(image_file):
    """Generate 576D embedding using MobileNetV3 Small (Optimized for Production)."""
    if not HAS_ML: return None
    try:
        # Load and verify image
        img = Image.open(image_file).convert('RGB')
        img_tensor = preprocess(img).unsqueeze(0).to(device)
        
        # 🔥 Production Optimization: inference_mode is faster than no_grad
        with torch.inference_mode():
            features = model(img_tensor)
            
        return features.squeeze().cpu().numpy().tolist()
    except Exception as e:
        print(f"[ERROR] AI feature extraction failed: {e}")
        return None

def search_products_by_image(image_file):
    """Returns top 5 matches with category-first filtering."""
    if not HAS_ML: return {"status": "error", "message": "AI Engine is unavailable."}
        
    try:
        query_features = get_image_features(image_file)
        if query_features is None: return {"status": "success", "products": []}

        all_products = ProductModel.get_all_products(active_only=True)
        if not all_products: return {"status": "success", "products": []}

        query_vec = np.array(query_features).reshape(1, -1)
        
        # 1. Quick Global Categorization
        temp_results = []
        for p in all_products:
            feat = p.get('cnn_features')
            if not feat: continue
            sim = float(cosine_similarity(query_vec, np.array(feat).reshape(1, -1))[0][0])
            temp_results.append({'category': p['category'], 'similarity': sim})
        
        if not temp_results: return {"status": "success", "products": []}
            
        temp_results.sort(key=lambda x: x['similarity'], reverse=True)
        detected_category = temp_results[0]['category']

        # 2. Targeted In-Category Matching
        category_products = ProductModel.get_products_by_category(detected_category)
        final_matches = []
        for p in category_products:
            db_feat = p.get('cnn_features')
            if not db_feat: continue
            similarity = float(cosine_similarity(query_vec, np.array(db_feat).reshape(1, -1))[0][0])
            final_matches.append({
                'id': str(p['_id']),
                'name': p['name'],
                'category': p['category'],
                'price': p['price'],
                'image_url': p.get('image_url', ''),
                'confidence': round(similarity * 100, 1)
            })

        final_matches.sort(key=lambda x: x['confidence'], reverse=True)
        return {
            'status': 'success',
            'detected_category': detected_category,
            'products': final_matches[:5]
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

def index_all_products():
    """Admin re-indexing tool."""
    products = ProductModel.get_all_products(active_only=False)
    count = 0
    print(f"[WAIT] Re-indexing {len(products)} products with MobileNetV3 Small...")
    for p in products:
        img_url = p.get('image_url','')
        img_path = img_url.lstrip('/')
        if os.path.exists(img_path):
            features = get_image_features(img_path)
            if features:
                ProductModel.update_features(p['_id'], features)
                count += 1
    return count
