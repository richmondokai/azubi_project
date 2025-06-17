// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart display
function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartVat = document.querySelector('.cart-vat');
    const cartGrandTotal = document.querySelector('.cart-grand-total');
    
    // Clear existing items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '$0';
        cartVat.textContent = '$0';
        cartGrandTotal.textContent = '$0';
        return;
    }
    
    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 50;
    const vat = subtotal * 0.2;
    const grandTotal = subtotal + shipping + vat;
    
    // Update totals
    cartTotal.textContent = `$${subtotal}`;
    cartVat.textContent = `$${vat.toFixed(2)}`;
    cartGrandTotal.textContent = `$${grandTotal.toFixed(2)}`;
    
    // Create cart items
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>$${item.price}</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });
}

// Handle quantity changes
function handleQuantityChange(e) {
    const id = e.target.dataset.id;
    const isPlus = e.target.classList.contains('plus');
    
    const item = cart.find(item => item.id === parseInt(id));
    if (item) {
        if (isPlus) {
            item.quantity++;
        } else {
            item.quantity--;
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== parseInt(id));
            }
        }
        
        saveCart();
        updateCartDisplay();
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Handle checkout
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length > 0) {
        window.location.href = 'checkout.html';
    }
});

// Initialize cart display
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    updateCartCount();
}); 