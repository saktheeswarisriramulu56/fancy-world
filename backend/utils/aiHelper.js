const Product = require('../models/Product');

// categories supported by our CNN model
const CATEGORIES = ['Bangles', 'Anklets', 'Studs', 'Jhumkas', 'Chains', 'Necklaces'];

/**
 * Simulates CNN image classification
 * In production, you would use:
 * const tf = require('@tensorflow/tfjs-node');
 * const model = await tf.loadLayersModel('file://path/to/model.json');
 */
const classifyImage = async (imagePath) => {
    console.log(`Analyzing image at ${imagePath} with CNN model...`);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For the demo, we pick a category based on the filename or just random
    // In a real implementation, this would be the output of model.predict()
    const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const confidence = (Math.random() * 15 + 85).toFixed(2); // 85-100%

    return {
        category: randomCategory,
        confidence: confidence
    };
};

/**
 * Recommends similar products based on the classified category
 */
const getRecommendations = async (category) => {
    try {
        // Find products in the same category
        const recommendations = await Product.find({ category }).limit(4);
        return recommendations;
    } catch (err) {
        console.error('Error fetching recommendations:', err);
        return [];
    }
};

module.exports = { classifyImage, getRecommendations };
