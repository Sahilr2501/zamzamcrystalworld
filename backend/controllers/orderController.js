const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!orderItems?.length) {
        res.status(400);
        throw new Error('No order items');
    }
    if (!shippingAddress) {
        res.status(400);
        throw new Error('Shipping address is required');
    }

    let couponDiscount = 0;
    if (couponCode) {
        const Coupon = require('../models/couponModel');
        const coupon = await Coupon.findOne({
            code: couponCode.toUpperCase(),
            isActive: true,
            expiryDate: { $gt: new Date() },
        });
        if (coupon) {
            const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
            if (itemsPrice >= coupon.minOrderValue) {
                couponDiscount =
                    coupon.discountType === 'percentage'
                        ? (itemsPrice * coupon.discountValue) / 100
                        : coupon.discountValue;
            }
        }
    }

    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
    const shippingPrice = itemsPrice > 999 ? 0 : 99;
    const totalPrice = itemsPrice + taxPrice + shippingPrice - couponDiscount;

    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.name}`);
        }
        const variant = product.variants.find((v) => v.sku === item.sku);
        if (!variant || variant.countInStock < item.qty) {
            res.status(400);
            throw new Error(`Insufficient stock for ${item.name}`);
        }
        variant.countInStock -= item.qty;
        await product.save();
    }

    const order = await Order.create({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'COD',
        pricingBreakdown: {
            itemsPrice,
            taxPrice,
            shippingPrice,
            couponDiscount,
            totalPrice,
        },
    });

    res.status(201).json(order);
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to view this order');
    }
    res.json(order);
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = req.body.paymentResult || { status: 'paid' };

    const updated = await order.save();
    res.json(updated);
});

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate('user', 'id name email')
        .sort({ createdAt: -1 });
    res.json(orders);
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.deliveryStatus = req.body.deliveryStatus || 'Delivered';
    if (order.deliveryStatus === 'Delivered') {
        order.deliveredAt = Date.now();
    }

    const updated = await order.save();
    res.json(updated);
});

module.exports = {
    createOrder,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getAllOrders,
    updateOrderToDelivered,
};
