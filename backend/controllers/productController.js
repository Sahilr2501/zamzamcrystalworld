const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

const getProducts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.brand) filter.brand = req.query.brand;
    if (req.query.featured === 'true') filter.isFeatured = true;
    if (req.query.keyword) {
        filter.$text = { $search: req.query.keyword };
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .sort(req.query.keyword ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-reviews');

    res.json({
        products,
        page,
        pages: Math.ceil(count / limit) || 1,
        total: count,
    });
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    res.json(product);
});

const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        ...req.body,
        user: req.user._id,
    });
    const created = await product.save();
    res.status(201).json(created);
});

const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    await product.deleteOne();
    res.json({ message: 'Product removed' });
});

const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
        res.status(400);
        throw new Error('rating and comment are required');
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
    }

    const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
});

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Product.distinct('category');
    res.json(categories);
});

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getCategories,
};
