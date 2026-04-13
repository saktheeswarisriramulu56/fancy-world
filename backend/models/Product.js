const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // Bangles, Anklets, Studs, Jhumkas, Chains, Necklaces
    price: { type: Number, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    trending: { type: Boolean, default: false }
});

module.exports = mongoose.model('Product', productSchema);
