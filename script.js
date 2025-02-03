// Register User
document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  const user = { name, email, password };
  localStorage.setItem('user', JSON.stringify(user));
  alert('Registration successful! Please login.');
});

// Login User
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.email === email && user.password === password) {
    alert('Login successful!');
    window.location.href = 'index.html';
  } else {
    alert('Invalid credentials!');
  }
});
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
  const product = document.querySelector(`.product[data-id="${productId}"]`);
  const productName = product.getAttribute('data-name');
  const productPrice = parseFloat(product.getAttribute('data-price'));

  const item = { id: productId, name: productName, price: productPrice };
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${productName} added to cart!`);
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const totalElement = document.getElementById('total');
  let total = 0;

  cartItems.innerHTML = '';
  cart.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.innerHTML = `<p>${item.name} - $${item.price}</p>`;
    cartItems.appendChild(itemElement);
    total += item.price;
  });

  totalElement.textContent = total.toFixed(2);
}

// Render cart on cart.html
if (window.location.pathname.includes('cart.html')) {
  renderCart();
}

function checkout() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const options = {
    key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
    amount: total * 100, // Amount in paise
    currency: 'INR',
    name: 'Your Store',
    description: 'Payment for your order',
    handler: function (response) {
      alert('Payment successful!');
      localStorage.removeItem('cart');
      window.location.href = 'index.html';
    },
    prefill: {
      name: JSON.parse(localStorage.getItem('user')).name,
      email: JSON.parse(localStorage.getItem('user')).email,
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
}



