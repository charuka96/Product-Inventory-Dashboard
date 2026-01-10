const API_URL = "https://dummyjson.com/products?limit=10";
let productContainer;
let modal;

document.addEventListener("DOMContentLoaded", () => {
  productContainer = document.getElementById("productContainer");

  modal = new bootstrap.Modal(document.getElementById("productModal"));

  loadProducts();
});

// Load products from API
async function loadProducts() {
  const res = await fetch(API_URL);
  const data = await res.json();
  displayProducts(data.products);
  console.log(data.products);
}

function displayProducts(products) {
  productContainer.innerHTML = "";

  products.forEach((p) => {
    productContainer.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="card product-card h-100 shadow-sm">
          <img src="${p.thumbnail}" class="card-img-top">
          <div class="card-body">
            <h6>${p.title}</h6>
            <p class="mb-1"><strong>$${p.price}</strong></p>
            <small class="text-muted">${p.category}</small>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-sm btn-warning">Edit</button>
            <button class="btn btn-sm btn-danger">Delete</button>
          </div>
        </div>
      </div>
    `;
  });
}
