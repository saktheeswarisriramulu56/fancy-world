const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderID: { type: String, unique: true, default: () => 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase() },
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: {
        type: String,
        enum: ['Placed', 'Dispatched', 'Delivered', 'Cancelled'],
        default: 'Placed'
    },
    courierDetails: {
        provider: { type: String, default: '' },
        trackingId: { type: String, default: '' },
        dispatchedDate: { type: Date }
    },
    aiVerification: {
        categoryPredicted: { type: String },
        confidence: { type: Number },
        verificationStatus: { type: String, default: 'Pending' }
    },
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String
    }],
    orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
