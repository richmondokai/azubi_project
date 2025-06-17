const fs = require('fs');
const path = require('path');

// Define source and destination directories
const sourceDir = path.join(__dirname, 'assets');
const destDir = path.join(__dirname, 'assets');

// Create destination directories if they don't exist
const createDirIfNotExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Copy directory recursively
const copyDir = (src, dest) => {
    createDirIfNotExists(dest);
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
};

// Copy shared assets
const sharedSrc = path.join(sourceDir, 'shared');
const sharedDest = path.join(destDir, 'shared');
copyDir(sharedSrc, sharedDest);

// Copy product assets
const products = [
    'xx99-mark-two-headphones',
    'xx99-mark-one-headphones',
    'xx59-headphones',
    'zx9-speaker',
    'zx7-speaker',
    'yx1-earphones'
];

products.forEach(product => {
    const productSrc = path.join(sourceDir, `product-${product}`);
    const productDest = path.join(destDir, `product-${product}`);
    copyDir(productSrc, productDest);
});

console.log('Assets copied successfully!'); 