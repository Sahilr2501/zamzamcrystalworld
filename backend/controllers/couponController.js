const asyncHandler = require('express-async-handler');
const Coupon = require('../models/couponModel');

const validateCoupon = asyncHandler(async (req, res) => {
    const { code, orderTotal } = req.body;

    if (!code) {
        res.status(400);
        throw new Error('Coupon code is required');
    }

    const coupon = await Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true,
        expiryDate: { $gt: new Date() },
    });

    if (!coupon) {
        res.status(404);
        throw new Error('Invalid or expired coupon');
    }

    const total = Number(orderTotal) || 0;
    if (total < coupon.minOrderValue) {
        res.status(400);
        throw new Error(`Minimum order value is ₹${coupon.minOrderValue}`);
    }

    const discount =
        coupon.discountType === 'percentage'
            ? (total * coupon.discountValue) / 100
            : coupon.discountValue;

    res.json({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount: Math.min(discount, total),
    });
});

const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
});

const createCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
        res.status(404);
        throw new Error('Coupon not found');
    }
    await coupon.deleteOne();
    res.json({ message: 'Coupon removed' });
});

module.exports = {
    validateCoupon,
    getCoupons,
    createCoupon,
    deleteCoupon,
};
