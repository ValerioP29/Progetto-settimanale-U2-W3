const productsURL = "https://striveschool-api.herokuapp.com/api/product/";
const productKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY2NGU4MTc5YzQ1ZjAwMTU2OWI0YjMiLCJpYXQiOjE3Mjc0MTc5ODUsImV4cCI6MTcyODYyNzU4NX0.TWD_GpyfDeFyqreFAF5n_FZp3x76FaUpkX58UD5dz08";
let arrayOfProducts = [];

const getProduct = function () {
  fetch(productsURL, {
    headers: {
      Authorization: productKey,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nella risposta del server");
      }
    })
    .then((data) => {
      console.log("PRODOTTI DISPONIBILI", data);
      arrayOfProducts = data;
      createProductCard(data);
    })
    .catch((err) => {
      console.log("ERRORE", err);
    });
};

const createProductCard = function (arrayOfProducts) {
  const row = document.getElementById("product-row");
  row.innerHTML = "";
  arrayOfProducts.forEach((product) => {
    const newCol = document.createElement("div");
    newCol.classList.add("col", "col-12", "col-md-4", "col-lg-3");
    newCol.innerHTML = `
      <div class="card h-100 border-secondary shadow-lg rounded">
        <img src="${product.imageUrl}" class="card-img-top img-fluid" alt="${product.name || "Immagine bottiglia"}" style="height: 200px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <p class="card-text fw-bold">${product.price}€</p>
          <p class="card-text text-muted">${product.brand}</p>
          <div class="mt-auto">
            <a href="./details.html?productId=${product._id}" class="btn btn-primary mb-1">VAI AI DETTAGLI</a>
            <button class="btn btn-warning mb-1" onclick="editProduct('${product._id}')">MODIFICA</button>
          </div>
        </div>
      </div>
    `;
    row.appendChild(newCol);
  });
};

function editProduct(productId) {
  const product = arrayOfProducts.find((p) => p._id === productId);

  if (!product) {
    console.error(`Prodotto con ID ${productId} non trovato.`);
    return;
  }

  document.getElementById("productId").value = product._id;
  document.getElementById("name").value = product.name;
  document.getElementById("description").value = product.description;
  document.getElementById("price").value = product.price;
  document.getElementById("brand").value = product.brand;
  document.getElementById("image").value = product.imageUrl;

  // Mostra il modulo di modifica
  const editModal = new bootstrap.Modal(document.getElementById("editModal"));
  editModal.show();
}

getProduct();
