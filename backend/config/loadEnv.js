// Load .env locally; on Render, env vars are injected by the platform.
try {
    require('dotenv').config();
} catch (err) {
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('dotenv not available:', err.message);
    }
}
