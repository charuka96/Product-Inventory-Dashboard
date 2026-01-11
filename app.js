const API_URL = "https://dummyjson.com/products?limit=10";
let productContainer;
let modal;
let productsList = [];
document.addEventListener("DOMContentLoaded", () => {
  productContainer = document.getElementById("productContainer");

  modal = new bootstrap.Modal(document.getElementById("productModal"));

  loadProducts();
});

// Load products from API
async function loadProducts() {
  const res = await fetch(API_URL);
  const data = await res.json();
  productsList = data.products;
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
            <button class="btn btn-sm btn-warning" onclick="editProduct(${p.id})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">Delete</button>
          </div>
        </div>
      </div>`;
  });
}


//addProduct
document.getElementById("productForm").addEventListener("submit", addProduct);
async function addProduct(event){
    event.preventDefault();

    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").value;


    const newProduct = {      
        title,
        price,
        category,
        thumbnail: image
    };
    const responce = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newProduct)
    });
    const data = await responce.json();
    console.log("Product added:", data);
    modal.hide();
    loadProducts();
}


//deleteProduct
function deleteProduct(id) {
 
  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then((res) => res.json())
    .then((data) => {
      console.log("Product deleted (simulated):", data);
      productsList = productsList.filter((p) => p.id !== id);
      displayProducts(productsList);
    })
    .catch((err) => console.error("Delete error:", err));
}

//updateProduct

let editingProductId = null;
async function editProduct(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const product = await res.json();

    // Pre-fill form fields
    document.getElementById("productId").value = product.id;
    document.getElementById("title").value = product.title;
    document.getElementById("price").value = product.price;
    document.getElementById("category").value = product.category;
    document.getElementById("image").value = product.thumbnail || "";

    // Update modal title
    document.getElementById("modalTitle").innerText = "Update Product";

    // Show modal
    const productModal = new bootstrap.Modal(
      document.getElementById("productModal")
    );
    productModal.show();
  } catch (err) {
    console.error("Failed to fetch product:", err);
  }
}

document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("productId").value;
  const updatedProduct = {
    title: document.getElementById("title").value,
    price: Number(document.getElementById("price").value),
    category: document.getElementById("category").value,
    thumbnail: document.getElementById("image").value,
  };

  if (id) {
    // Update existing product
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    const data = await res.json();
    console.log("Product updated:", data);

    
    productsList = productsList.map((p) => (p.id == id ? data : p));
    displayProducts(productsList);

    alert("Product updated successfully!");
  } else {
    
    addProduct(updatedProduct); 
  }

  // Close modal
  const productModalEl = document.getElementById("productModal");
  const modalInstance = bootstrap.Modal.getInstance(productModalEl);
  modalInstance.hide();

  // Reset form
  e.target.reset();
  document.getElementById("productId").value = "";
  document.getElementById("modalTitle").innerText = "Add Product";
});

