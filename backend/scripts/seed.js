require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');

const sampleProducts = [
    {
        name: 'Amethyst Healing Cluster',
        brand: 'Zamzam',
        category: 'Healing Stones',
        description: 'Natural amethyst cluster known for calming energy, stress relief, and spiritual balance. Ideal for meditation spaces.',
        images: ['https://images.unsplash.com/photo-1611080626919-7a0436b5c5c9?w=600&q=80'],
        isFeatured: true,
        variants: [{ sku: 'AME-001', price: 1299, mrp: 1599, countInStock: 25, attributes: { size: 'Medium' } }],
    },
    {
        name: 'Rose Quartz Heart',
        brand: 'Zamzam',
        category: 'Healing Stones',
        description: 'Polished rose quartz heart — the stone of love and compassion. A thoughtful gift for wellness and harmony.',
        images: ['https://images.unsplash.com/photo-1601121141461-9d6647bca1ec?w=600&q=80'],
        isFeatured: true,
        variants: [{ sku: 'ROQ-001', price: 599, mrp: 799, countInStock: 40, attributes: { size: 'Small' } }],
    },
    {
        name: 'Clear Quartz Point',
        brand: 'Zamzam',
        category: 'Points & Towers',
        description: 'High-clarity quartz point for amplifying intention and cleansing energy in your home or workspace.',
        images: ['https://images.unsplash.com/photo-1603564480360-27b4a7f85452?w=600&q=80'],
        isFeatured: true,
        variants: [{ sku: 'QUA-001', price: 899, mrp: 1099, countInStock: 30, attributes: { size: 'Large' } }],
    },
    {
        name: 'Black Tourmaline Protection Stone',
        brand: 'Zamzam',
        category: 'Protection',
        description: 'Raw black tourmaline for grounding and protection against negative energy. Place near entrances.',
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80'],
        isFeatured: false,
        variants: [{ sku: 'BTO-001', price: 749, mrp: 949, countInStock: 20, attributes: { size: 'Medium' } }],
    },
];

const run = async () => {
    await connectDB();

    let admin = await User.findOne({ email: 'admin@zamzam.com' });
    if (!admin) {
        admin = await User.create({
            name: 'Admin',
            email: 'admin@zamzam.com',
            password: 'admin123',
            isAdmin: true,
        });
        console.log('Created admin: admin@zamzam.com / admin123');
    } else {
        console.log('Admin already exists: admin@zamzam.com');
    }

    const count = await Product.countDocuments();
    if (count === 0) {
        for (const p of sampleProducts) {
            await Product.create({ ...p, user: admin._id });
        }
        console.log(`Seeded ${sampleProducts.length} products`);
    } else {
        console.log(`Products already exist (${count}), skipping product seed`);
    }

    const couponExists = await Coupon.findOne({ code: 'WELCOME10' });
    if (!couponExists) {
        await Coupon.create({
            code: 'WELCOME10',
            discountType: 'percentage',
            discountValue: 10,
            minOrderValue: 500,
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        });
        console.log('Created coupon: WELCOME10 (10% off, min ₹500)');
    }

    await mongoose.disconnect();
    console.log('Seed complete');
    process.exit(0);
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
