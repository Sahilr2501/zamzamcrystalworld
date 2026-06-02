const path = require('path');
const fs = require('fs');
const { ensureUploadDir, UPLOAD_DIR } = require('../config/upload');

ensureUploadDir();
const productsDir = path.join(UPLOAD_DIR, 'products');
if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
}
// eslint-disable-next-line no-console
console.log('Upload directories ready:', productsDir);
