const express = require('express');
const { uploadImages, deleteImage } = require('../controllers/uploadController');
const { uploadProductImages } = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
    '/images',
    protect,
    admin,
    uploadProductImages.array('images', 8),
    uploadImages
);
router.delete('/images/:filename', protect, admin, deleteImage);

module.exports = router;
