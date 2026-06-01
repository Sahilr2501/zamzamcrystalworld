const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { ensureUploadDir } = require('../config/upload');

const productsDir = path.join(ensureUploadDir(), 'products');
if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, productsDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
        const base = path.basename(file.originalname, path.extname(file.originalname));
        const safe = base.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 40) || 'image';
        cb(null, `${Date.now()}-${safe}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (/^image\/(jpeg|jpg|png|gif|webp)$/i.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'));
    }
};

const uploadProductImages = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 8 },
});

module.exports = { uploadProductImages, productsDir };
