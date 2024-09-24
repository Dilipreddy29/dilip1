let productsData = [];
let cart = [];

// Fetch product data from the API
fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(data => {
    productsData = data;
    displayProducts(data); // Display all products initially
  })
  .catch(err => {
    console.error("Error fetching product data:", err);
  });

// Function to display products in cards
function displayProducts(products) {
  const container = document.getElementById("card-container");
  container.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${product.image}" class="card-img-top text-center" alt="${product.title}">
      <div class="card-body">
        <h5 class="card-title one">${product.title}</h5>
        <p class="card-text"><strong>Category: </strong>${product.category}</p>
        <p class="card-text"><strong>Price: </strong>$${product.price.toFixed(2)}</p>
        <div class="btn btn-outline-primary cartbtn">Add to cart</div>
      </div>
      <div class="card-footer">
        <small class="text-muted">Rating: ${product.rating.rate} (${product.rating.count} reviews)</small>
      </div>
    `;

    const cartButton = card.querySelector('.cartbtn');
    cartButton.addEventListener('click', () => {
      addToCart(product);
    });

    container.appendChild(card);
  });
}

// Function to add items to the cart
function addToCart(product) {
  cart.push(product);
  updateCartDisplay();
}

// Function to remove items from the cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

// Function to update cart display
function updateCartDisplay() {
  const cartItemsElement = document.getElementById('cart-items');
  cartItemsElement.innerHTML = '';

  let subtotal = 0;

  cart.forEach((product, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'align-items-center', 'justify-content-between');

    listItem.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${product.image}" alt="${product.title}" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: contain; margin-right: 10px;">
        <span>${product.title} - $${product.price.toFixed(2)}</span>
      </div>
      <button class="btn btn-danger btn-sm remove-btn">Remove</button>
    `;

    listItem.querySelector('.remove-btn').addEventListener('click', () => {
      removeFromCart(index);
    });

    cartItemsElement.appendChild(listItem);
    subtotal += product.price;
  });

  // Update price calculations
  const subtotalElement = document.getElementById('subtotal');
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;

  // Calculate taxes and total
  const taxRate = 0.30;
  const shippingFee = 50.00;

  const taxes = subtotal * taxRate;
  const total = subtotal + taxes + shippingFee;

  // Update taxes and total in the DOM
  const taxesElement = document.getElementById('taxes');
  taxesElement.textContent = `$${taxes.toFixed(2)}`;

  const totalElement = document.getElementById('total');
  totalElement.textContent = `$${total.toFixed(2)}`;
}

// Search functionality
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form from refreshing the page
  const searchInput = document.getElementById('search-input').value.toLowerCase();
  const filteredProducts = productsData.filter(product => 
    product.title.toLowerCase().includes(searchInput) || 
    product.category.toLowerCase().includes(searchInput)
  );
  displayProducts(filteredProducts);
});
