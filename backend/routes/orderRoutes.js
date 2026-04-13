const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders (Real-time Admin Dashboard)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Place a new order with instantaneous update
router.post('/', async (req, res) => {
    try {
        const order = new Order(req.body);
        const newOrder = await order.save();

        // Emit real-time event to admin dashboard
        req.io.emit('newOrder', newOrder);

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update order status with real-time notification
router.patch('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Update basic fields
        if (req.body.status) {
            order.status = req.body.status;
            order.statusHistory.push({
                status: req.body.status,
                note: req.body.note || `Status updated to ${req.body.status}`
            });
        }

        // Update courier details if provided
        if (req.body.courierDetails) {
            order.courierDetails = { ...order.courierDetails, ...req.body.courierDetails };
            if (req.body.status === 'Dispatched') {
                order.courierDetails.dispatchedDate = new Date();
            }
        }

        const updatedOrder = await order.save();

        // Notify all clients of the update
        req.io.emit('orderUpdate', updatedOrder);

        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
