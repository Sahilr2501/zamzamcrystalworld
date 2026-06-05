require('./config/loadEnv');
const express = require('express');

const cors = require('cors');
const cookieParser = require('cookie-parser');

const path = require('path');
const connectDB = require('./config/db');
const { ensureUploadDir, UPLOAD_DIR } = require('./config/upload');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');


const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const couponRoutes = require('./routes/couponRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
    // When credentials are used, the server cannot blindly return "*".
    // Use a dynamic origin function to properly support multiple frontend origins
    // (local dev + deployed domains).
    origin: (origin, callback) => {
        // Allow non-browser requests (no Origin header)
        if (!origin) return callback(null, true);

        // If CORS_ORIGIN is set, treat it as a comma-separated allowlist.
        // Example: CORS_ORIGIN="https://zamzamcrystalworld.vercel.app,http://localhost:3000"
        const allowlist = (process.env.CORS_ORIGIN || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        // If no allowlist provided, allow all origins.
        if (allowlist.length === 0) return callback(null, true);

        if (allowlist.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.resolve(UPLOAD_DIR)));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Keep demo endpoint for frontend compatibility
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from backend!' });
});

app.post('/api/echo', (req, res) => {
    res.json({ received: req.body });
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
    ensureUploadDir();
    await connectDB();
    app.listen(port, () => {

        // eslint-disable-next-line no-console
        console.log(`Backend listening on http://localhost:${port}`);
    });
};

start().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err);
    process.exit(1);
});

module.exports = app;

