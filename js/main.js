// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Add to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    saveCart();
    updateCartCount();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
}

// Update quantity
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        }
    }
    saveCart();
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Calculate total
function calculateTotal() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 50;
    const vat = subtotal * 0.2;
    const total = subtotal + shipping + vat;
    
    return {
        subtotal,
        shipping,
        vat,
        total
    };
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
});

// Cart Popup Modal Implementation

document.addEventListener('DOMContentLoaded', function () {
    // Insert cart modal HTML
    const cartModal = document.createElement('div');
    cartModal.className = 'cart-modal';
    cartModal.innerHTML = `
        <div class="cart-popup">
            <div class="cart-popup-header">
                <span class="cart-popup-title">CART (<span class="cart-popup-count">0</span>)</span>
                <button class="cart-popup-remove">Remove all</button>
            </div>
            <div class="cart-popup-items"></div>
            <div class="cart-popup-total-row">
                <span class="cart-popup-total-label">TOTAL</span>
                <span class="cart-popup-total-value">$0</span>
            </div>
            <button class="btn btn-primary cart-popup-checkout">CHECKOUT</button>
        </div>
    `;
    cartModal.style.display = 'none';
    document.body.appendChild(cartModal);

    // Show modal on cart icon click
    const cartLink = document.querySelector('.cart-link');
    cartLink.addEventListener('click', function (e) {
        e.preventDefault();
        updateCartPopup();
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Hide modal on outside click
    cartModal.addEventListener('click', function (e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Update cart popup content
    function updateCartPopup() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemsContainer = cartModal.querySelector('.cart-popup-items');
        const countSpan = cartModal.querySelector('.cart-popup-count');
        const totalValue = cartModal.querySelector('.cart-popup-total-value');
        itemsContainer.innerHTML = '';
        countSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-popup-item';
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-popup-img">
                <div class="cart-popup-info">
                    <div class="cart-popup-name">${item.name}</div>
                    <div class="cart-popup-price">$${item.price}</div>
                </div>
                <div class="cart-popup-qty">
                    <button class="cart-popup-qty-btn" data-id="${item.id}" data-action="minus">-</button>
                    <span>${item.quantity}</span>
                    <button class="cart-popup-qty-btn" data-id="${item.id}" data-action="plus">+</button>
                </div>
            `;
            itemsContainer.appendChild(itemDiv);
        });
        totalValue.textContent = `$${total.toLocaleString()}`;
        if (cart.length === 0) {
            itemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            totalValue.textContent = '$0';
        }
    }

    // Quantity change
    cartModal.addEventListener('click', function (e) {
        if (e.target.classList.contains('cart-popup-qty-btn')) {
            const id = parseInt(e.target.dataset.id);
            const action = e.target.dataset.action;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const item = cart.find(i => i.id === id);
            if (item) {
                if (action === 'plus') item.quantity++;
                if (action === 'minus') item.quantity--;
                if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartPopup();
                // Also update cart count in header
                const cartCount = document.querySelector('.cart-count');
                if (cartCount) cartCount.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
            }
        }
    });

    // Remove all
    cartModal.querySelector('.cart-popup-remove').addEventListener('click', function () {
        localStorage.setItem('cart', JSON.stringify([]));
        updateCartPopup();
        // Also update cart count in header
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) cartCount.textContent = 0;
    });

    // Checkout button
    cartModal.querySelector('.cart-popup-checkout').addEventListener('click', function () {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length > 0) {
            // If on a product page, use '../checkout.html', else use 'checkout.html'
            if (window.location.pathname.includes('/product/')) {
                window.location.href = '../checkout.html';
            } else {
                window.location.href = 'checkout.html';
            }
        }
    });
});

// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const menuOverlay = document.querySelector('.menu-overlay');
    const body = document.body;

    menuToggle.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        body.classList.toggle('menu-open');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    menuOverlay.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        menuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
        menuToggle.classList.remove('active');
    });

    // Close menu when clicking a nav link
    const mobileNavLinks = mobileNav.querySelectorAll('.nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            menuOverlay.classList.remove('active');
            body.classList.remove('menu-open');
            menuToggle.classList.remove('active');
        });
    });
}); 