const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Inference = require('../models/Inference');

// Aggregated Stats for Charts
router.get('/dashboard-stats', async (req, res) => {
    try {
        // 1. Orders by Category (Pie Chart)
        const ordersByCategory = await Order.aggregate([
            { $group: { _id: "$productName", count: { $sum: "$quantity" } } }
        ]);

        // 2. Orders by Status
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // 3. Recent AI Inferences (Trending Patterns)
        const trendingAI = await Inference.aggregate([
            { $group: { _id: "$predictedCategory", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]);

        // 4. Daily Order Volume (Bar Chart - Mocking trend for demo)
        const dailyOrders = [
            { day: 'Mon', count: 12 },
            { day: 'Tue', count: 19 },
            { day: 'Wed', count: 15 },
            { day: 'Thu', count: 22 },
            { day: 'Fri', count: 30 },
            { day: 'Sat', count: 25 },
            { day: 'Sun', count: 18 }
        ];

        res.json({
            ordersByCategory,
            ordersByStatus,
            trendingAI,
            dailyOrders,
            totalRevenue: 1250000 // Placeholder for demo
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
