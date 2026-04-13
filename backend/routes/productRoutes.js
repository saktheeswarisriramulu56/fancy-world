const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Inference = require('../models/Inference');
const { classifyImage, getRecommendations } = require('../utils/aiHelper');
const multer = require('multer');
const path = require('path');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// AI Classification Route with Persistence
router.post('/classify', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send('No file uploaded.');

        // Simulating CNN classification
        const result = await classifyImage(req.file.path);

        // Persist inference result for admin reference
        const inferenceLog = new Inference({
            imageId: req.file.filename,
            imageUrl: `/uploads/${req.file.filename}`,
            predictedCategory: result.category,
            confidenceScore: result.confidence,
            patternsDetected: ['Silhouette Match', 'Texture Verified']
        });
        await inferenceLog.save();

        // Get recommendations based on classified type
        const recommendations = await getRecommendations(result.category);

        res.json({
            category: result.category,
            confidence: result.confidence,
            recommendations: recommendations,
            logId: inferenceLog._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
