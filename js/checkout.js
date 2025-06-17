// Form validation
const form = document.getElementById('checkout-form');
const paymentMethods = document.querySelectorAll('input[name="payment"]');
const eMoneyFields = document.querySelectorAll('.e-money-fields');

// Show/hide e-money fields and cash info based on payment method
paymentMethods.forEach(method => {
    method.addEventListener('change', (e) => {
        const isEMoney = e.target.value === 'e-money';
        document.querySelectorAll('.e-money-fields').forEach(field => field.style.display = isEMoney ? 'block' : 'none');
        const cashInfo = document.querySelector('.payment-cash-info');
        if (cashInfo) cashInfo.style.display = isEMoney ? 'none' : 'block';
        // Update selected class for payment options
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('selected');
            if (opt.querySelector('input[type="radio"]').checked) {
                opt.classList.add('selected');
            }
        });
    });
});

// On page load, set correct visibility and selected class
window.addEventListener('DOMContentLoaded', () => {
    const selected = document.querySelector('input[name="payment"]:checked');
    if (selected) {
        const isEMoney = selected.value === 'e-money';
        document.querySelectorAll('.e-money-fields').forEach(field => field.style.display = isEMoney ? 'block' : 'none');
        const cashInfo = document.querySelector('.payment-cash-info');
        if (cashInfo) cashInfo.style.display = isEMoney ? 'none' : 'block';
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('selected');
            if (opt.querySelector('input[type="radio"]').checked) {
                opt.classList.add('selected');
            }
        });
    }
});

// Form validation
function validateForm() {
    let isValid = true;
    const formData = new FormData(form);
    
    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(error => error.textContent = '');
    
    // Validate required fields
    for (let [key, value] of formData.entries()) {
        const input = document.getElementById(key);
        // Only require e-money fields if e-money is selected
        if ((key === 'e-money-number' || key === 'e-money-pin') && formData.get('payment') !== 'e-money') {
            continue;
        }
        if (!value) {
            isValid = false;
            input.nextElementSibling.textContent = 'This field is required';
        }
    }
    
    // Validate email
    const email = formData.get('email');
    if (email && !isValidEmail(email)) {
        isValid = false;
        document.getElementById('email').nextElementSibling.textContent = 'Please enter a valid email';
    }
    
    // Validate phone
    const phone = formData.get('phone');
    if (phone && !isValidPhone(phone)) {
        isValid = false;
        document.getElementById('phone').nextElementSibling.textContent = 'Please enter a valid phone number';
    }
    
    // Validate e-money fields if e-money is selected
    if (formData.get('payment') === 'e-money') {
        const eMoneyNumber = formData.get('e-money-number');
        const eMoneyPin = formData.get('e-money-pin');
        
        if (!eMoneyNumber || !isValidEMoneyNumber(eMoneyNumber)) {
            isValid = false;
            document.getElementById('e-money-number').nextElementSibling.textContent = 'Please enter a valid e-money number';
        }
        
        if (!eMoneyPin || !isValidEMoneyPin(eMoneyPin)) {
            isValid = false;
            document.getElementById('e-money-pin').nextElementSibling.textContent = 'Please enter a valid PIN';
        }
    }
    
    return isValid;
}

// Validation helpers
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\+?[\d\s-]{10,}$/.test(phone);
}

function isValidEMoneyNumber(number) {
    return /^\d{16}$/.test(number);
}

function isValidEMoneyPin(pin) {
    return /^\d{4}$/.test(pin);
}

// Attach event to the Continue & Pay button in the summary card
const continuePayBtn = document.querySelector('.summary-card .btn-primary');
if (continuePayBtn) {
    continuePayBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (validateForm()) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            let shipping = 50;
            let vat = Math.round(subtotal * 0.2);
            let grandTotal = subtotal + shipping + vat;
            showThankYouModal(cart, grandTotal);
            // Clear cart
            localStorage.setItem('cart', JSON.stringify([]));
            updateCartCount();
            renderCartSummary();
        }
    });
}

// Remove the form submit event for showing the modal
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
        // Optionally, you can submit the form via AJAX here if needed
        // But do not show the modal here anymore
    }
});

// Show order confirmation modal
function showOrderConfirmation() {
    const modal = document.getElementById('order-confirmation');
    const orderDetails = modal.querySelector('.order-details');
    
    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 50;
    const vat = subtotal * 0.2;
    const grandTotal = subtotal + shipping + vat;
    
    // Create order summary
    orderDetails.innerHTML = `
        <div class="order-items">
            ${cart.map(item => `
                <div class="order-item">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>$${item.price}</p>
                    </div>
                    <div class="item-quantity">
                        <span>x${item.quantity}</span>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="order-total">
            <div class="summary-row">
                <span>Total</span>
                <span>$${subtotal}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>$${shipping}</span>
            </div>
            <div class="summary-row">
                <span>VAT (20%)</span>
                <span>$${vat.toFixed(2)}</span>
            </div>
            <div class="summary-row grand-total">
                <span>Grand Total</span>
                <span>$${grandTotal.toFixed(2)}</span>
            </div>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('order-confirmation');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Render cart summary on checkout page load
function renderCartSummary() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.querySelector('.cart-items');
    const cartTotalSpan = document.querySelector('.cart-total');
    const cartVatSpan = document.querySelector('.cart-vat');
    const cartGrandTotalSpan = document.querySelector('.cart-grand-total');

    if (!cartItemsDiv) return;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotalSpan.textContent = '$0';
        cartVatSpan.textContent = '$0';
        cartGrandTotalSpan.textContent = '$0';
        return;
    }

    let subtotal = 0;
    cartItemsDiv.innerHTML = cart.map(item => {
        subtotal += item.price * item.quantity;
        return `
            <div class="cart-item">
                <div class="cart-item-img"><img src="${item.image}" alt="${item.name}" style="width:48px;height:48px;object-fit:contain;"></div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                </div>
                <div class="cart-item-qty">x${item.quantity}</div>
            </div>
        `;
    }).join('');
    const shipping = 50;
    const vat = Math.round(subtotal * 0.2);
    const grandTotal = subtotal + shipping + vat;
    cartTotalSpan.textContent = `$${subtotal.toLocaleString()}`;
    cartVatSpan.textContent = `$${vat.toLocaleString()}`;
    cartGrandTotalSpan.textContent = `$${grandTotal.toLocaleString()}`;
}

document.addEventListener('DOMContentLoaded', renderCartSummary);

// Show Thank You Modal after successful checkout
function showThankYouModal(cart, grandTotal) {
    const modal = document.getElementById('thankyou-modal');
    const productsDiv = document.getElementById('thankyou-products');
    const grandTotalSpan = document.getElementById('thankyou-grandtotal');
    if (!modal || !productsDiv || !grandTotalSpan) return;

    // Main product
    const first = cart[0];
    let html = '';
    if (first) {
        html += `<div class="thankyou-product-main">
            <div class="thankyou-product-img"><img src="${first.image}" alt="${first.name}" style="width:40px;height:40px;object-fit:contain;"></div>
            <div class="thankyou-product-details">
                <div class="thankyou-product-name">${first.name}</div>
                <div class="thankyou-product-price">$${first.price.toLocaleString()}</div>
            </div>
            <div class="thankyou-product-qty">x${first.quantity}</div>
        </div>`;
        if (cart.length > 1) {
            html += `<div class="thankyou-other-items">and ${cart.length - 1} other item(s)</div>`;
        }
    }
    productsDiv.innerHTML = html;
    grandTotalSpan.textContent = `$${grandTotal.toLocaleString()}`;
    modal.style.display = 'flex';

    document.getElementById('thankyou-home').onclick = function() {
        modal.style.display = 'none';
        window.location.href = 'index.html';
    };
} 