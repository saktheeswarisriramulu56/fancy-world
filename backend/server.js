const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PATCH"]
    }
});

let activeUsers = 0;
let pageVisits = { home: 0, shop: 0, ai: 0 };

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Inject socket.io into request object
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Connect to MongoDB (Users should set MONGODB_URI to their Atlas connection string)
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to Cloud Database (Business Core)'))
    .catch(err => console.error('Cloud DB Connection Failed', err));

// Socket.IO Connection Logic
io.on('connection', (socket) => {
    activeUsers++;
    io.emit('metricsUpdate', { activeUsers, pageVisits });

    socket.on('pageVisit', (page) => {
        if (pageVisits[page] !== undefined) {
            pageVisits[page]++;
            io.emit('metricsUpdate', { activeUsers, pageVisits });
        }
    });

    socket.on('disconnect', () => {
        activeUsers = Math.max(0, activeUsers - 1);
        io.emit('metricsUpdate', { activeUsers, pageVisits });
    });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Business Intelligence Core running on port ${PORT}`);
});
