// Get the current category from the URL
const currentCategory = window.location.pathname.split('/').pop().replace('.html', '');

// Load and display products
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        const products = await response.json();
        
        // Filter products by category
        const categoryProducts = products.filter(product => product.category === currentCategory);
        
        // Get the product grid container
        const productGrid = document.querySelector('.product-grid');
        
        // Clear existing content
        productGrid.innerHTML = '';
        
        // Create product cards
        categoryProducts.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image.desktop}" alt="${product.name}">
        </div>
        <div class="product-info">
            ${product.new ? '<span class="overline">New Product</span>' : ''}
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <a href="product/${product.slug}.html" class="btn btn-primary">See Product</a>
        </div>
    `;
    
    return card;
}

// Load products when the page loads
document.addEventListener('DOMContentLoaded', loadProducts); 