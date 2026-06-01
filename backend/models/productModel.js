const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        images: [{ type: String }],
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    },
    { timestamps: true }
);

const variantSchema = mongoose.Schema({
    sku: { type: String, required: true, unique: true, trim: true },
    attributes: {
        color: { type: String },
        storage: { type: String },
        size: { type: String },
    },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    countInStock: { type: Number, required: true, min: 0, default: 0 },
});

const productSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        name: { type: String, required: true, trim: true },
        images: [{ type: String, required: true }],
        brand: { type: String, required: true, index: true },
        category: { type: String, required: true, index: true },
        description: { type: String, required: true },
        variants: [variantSchema],
        reviews: [reviewSchema],
        rating: { type: Number, required: true, default: 0 },
        numReviews: { type: Number, required: true, default: 0 },
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);

