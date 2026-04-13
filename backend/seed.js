const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const products = [
    {
        name: 'Gold Bangle Set',
        category: 'Bangles',
        price: 45000,
        description: '22k Gold bangles with intricate traditional design',
        imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop',
        trending: true
    },
    {
        name: 'Crystal Anklets',
        category: 'Anklets',
        price: 1200,
        description: 'Sparkling crystal anklets for special occasions and daily wear',
        imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb0ce33e?q=80&w=1000&auto=format&fit=crop',
        trending: false
    },
    {
        name: 'Diamond Studs',
        category: 'Studs',
        price: 25000,
        description: 'Solitaire diamond studs in 18k white gold setting',
        imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
        trending: true
    },
    {
        name: 'Pearl Jhumkas',
        category: 'Jhumkas',
        price: 3500,
        description: 'Traditional pearl drop jhumkas with gold plating',
        imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop',
        trending: true
    },
    {
        name: 'Sleek Gold Chain',
        category: 'Chains',
        price: 15000,
        description: '18k minimalist gold chain, perfect for layering',
        imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop',
        trending: false
    },
    {
        name: 'Royal Necklace Set',
        category: 'Necklaces',
        price: 85000,
        description: 'Heavy bridal necklace with emeralds and rubies',
        imageUrl: 'https://images.unsplash.com/photo-1599643478123-55d470fcf551?q=80&w=1000&auto=format&fit=crop',
        trending: true
    },
    {
        name: 'Silver Jhumkas',
        category: 'Jhumkas',
        price: 2200,
        description: 'Oxidized silver jhumkas with tribal patterns',
        imageUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop',
        trending: false
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB for seeding...');
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('Database seeded successfully!');
        process.exit();
    })
    .catch(err => {
        console.error('Seeding error:', err);
        process.exit(1);
    });
