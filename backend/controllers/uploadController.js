const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const { UPLOAD_DIR } = require('../config/upload');

const uploadImages = asyncHandler(async (req, res) => {
    if (!req.files?.length) {
        res.status(400);
        throw new Error('No images uploaded');
    }

    const urls = req.files.map((file) => `/uploads/products/${file.filename}`);
    res.status(201).json({ urls });
});

const deleteImage = asyncHandler(async (req, res) => {
    const { filename } = req.params;
    if (!filename || filename.includes('..') || filename.includes('/')) {
        res.status(400);
        throw new Error('Invalid filename');
    }

    const filePath = path.join(UPLOAD_DIR, 'products', filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    res.json({ message: 'Image removed' });
});

module.exports = { uploadImages, deleteImage };
