const mongoose = require('mongoose');

const inferenceSchema = new mongoose.Schema({
    imageId: { type: String, required: true },
    imageUrl: { type: String, required: true },
    predictedCategory: { type: String, required: true },
    confidenceScore: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    patternsDetected: [String],
    verifiedByAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('Inference', inferenceSchema);
