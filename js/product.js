document.addEventListener('DOMContentLoaded', () => {
    const quantityElement = document.querySelector('.quantity');
    const minusButton = document.querySelector('.quantity-btn.minus');
    const plusButton = document.querySelector('.quantity-btn.plus');
    const addToCartButton = document.querySelector('.add-to-cart');

    // Quantity controls
    let quantity = 1;

    minusButton.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityElement.textContent = quantity;
        }
    });

    plusButton.addEventListener('click', () => {
        quantity++;
        quantityElement.textContent = quantity;
    });

    // Add to cart functionality
    addToCartButton.addEventListener('click', () => {
        const productName = document.querySelector('h1').textContent;
        const productPrice = parseFloat(document.querySelector('.product-price').textContent.replace('$', '').replace(',', ''));
        const productImage = document.querySelector('.main-image img').src;

        const cartItem = {
            name: productName,
            price: productPrice,
            quantity: quantity,
            image: productImage
        };

        // Get existing cart items from localStorage (use 'cart' key)
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => item.name === productName);

        if (existingItemIndex !== -1) {
            // Update quantity if item exists
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item if it doesn't exist
            cart.push(cartItem);
        }

        // Save updated cart to localStorage (use 'cart' key)
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update cart count
        updateCartCount();

        // Show success message
        showAddToCartMessage();
    });

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        cartCount.textContent = totalItems;
    }

    function showAddToCartMessage() {
        const message = document.createElement('div');
        message.className = 'add-to-cart-message';
        message.textContent = 'Added to cart!';
        document.body.appendChild(message);

        // Remove message after 2 seconds
        setTimeout(() => {
            message.remove();
        }, 2000);
    }

    // Initialize cart count
    updateCartCount();
}); 