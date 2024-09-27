const productsURL = "https://striveschool-api.herokuapp.com/api/product/";
const productKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY2NGU4MTc5YzQ1ZjAwMTU2OWI0YjMiLCJpYXQiOjE3Mjc0MTc5ODUsImV4cCI6MTcyODYyNzU4NX0.TWD_GpyfDeFyqreFAF5n_FZp3x76FaUpkX58UD5dz08";

const locationTypeProduct = new URLSearchParams(location.search);
const productId = locationTypeProduct.get("_id");

class Wines {
  constructor(_name, _description, _price, _brand, _imageUrl) {
    this.name = _name;
    this.description = _description;
    this.price = _price;
    this.brand = _brand;
    this.imageUrl = _imageUrl;
  }
}

const submitForm = document.getElementById("productForm");
const resetBtn = document.getElementById("resetBtn");
const editProductForm = document.getElementById("editProductForm");

let selectedProductId = null;

submitForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const brand = document.getElementById("brand").value;
  const imageUrl = document.getElementById("image").value;

  if (!name || !description || !price || !brand || !imageUrl) {
    alert("Per favore, compila tutti i campi.");
    return;
  }

  const wineBottle = new Wines(name, description, price, brand, imageUrl);

  let url = selectedProductId ? `${productsURL}${selectedProductId}` : productsURL;
  let methodToUse = selectedProductId ? "PUT" : "POST";

  const bodyContent = JSON.stringify(wineBottle);

  const headers = {
    "Content-Type": "application/json",
    Authorization: productKey,
  };

  fetch(url, {
    method: methodToUse,
    body: bodyContent,
    headers: headers,
  })
    .then((response) => {
      if (response.ok) {
        alert(selectedProductId ? "Modifica vino effettuata" : "Vino aggiunto");
        if (!selectedProductId) {
          submitForm.reset();
        }
        getProducts();
        // Reset del prodotto selezionato dopo la modifica
        selectedProductId = null;
      } else {
        throw new Error("Qualcosa è andato storto");
      }
    })
    .catch((err) => {
      console.log("C'è un errore", err);
    });
});

const getProducts = function () {
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
      createProductCard(data);
    })
    .catch((err) => {
      console.log("ERRORE", err);
    });
};

const createProductCard = function (arrayOfProducts) {
  const row = document.getElementById("backoffice-product-row");
  row.innerHTML = "";

  arrayOfProducts.forEach((product) => {
    const newCol = document.createElement("div");
    newCol.classList.add("col", "col-12", "col-md-4", "col-lg-3");
    newCol.innerHTML = `
            <div class="card h-100">
                <img src="${product.imageUrl || "./assets/logo.jpg"}" class="card-img-top" alt="${product.name || "Immagine del prodotto generica"}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text flex-grow-1">${product.description}</p>
                    <p class="card-text">${product.price}€</p>
                  
                    <button class="btn btn-warning" onclick="openEditModal('${product._id}')">MODIFICA</button>
                    <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">CANCELLA</button>
                </div>
            </div>
            `;
    row.appendChild(newCol);
  });
};

const openEditModal = function (productId) {
  fetch(`${productsURL}${productId}`, {
    method: "GET",
    headers: {
      Authorization: productKey,
    },
  })
    .then((product) => {
      // Popola il modale con i dettagli del prodotto
      document.getElementById("name").value = product.name;
      document.getElementById("description").value = product.description;
      document.getElementById("price").value = product.price;
      document.getElementById("brand").value = product.brand;
      document.getElementById("image").value = product.imageUrl;

      // Imposta l'ID del prodotto selezionato per la modifica
      selectedProductId = productId;

      // Mostra il modale
      const modal = new bootstrap.Modal(document.getElementById("editProductModal"));
      modal.show();
    })
    .catch((err) => {
      console.log("Oh Oh, errore!", err);
    });
};

editProductForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const brand = document.getElementById("brand").value;
  const imageUrl = document.getElementById("image").value;

  const wineBottle = new Wines(name, description, price, brand, imageUrl);

  fetch(`${productsURL}${selectedProductId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: productKey,
    },
    body: JSON.stringify(wineBottle),
  })
    .then((response) => {
      if (response.ok) {
        alert("Modifica vino effettuata");
        getProducts();

        const modal = bootstrap.Modal.getInstance(document.getElementById("editProductModal"));
        modal.hide();
        selectedProductId = null; //
      } else {
        throw new Error("Qualcosa è andato storto");
      }
    })
    .catch((err) => {
      console.log("C'è un errore", err);
    });
});

const deleteProduct = function (id) {
  if (confirm("Sei sicuro di voler cancellare questo prodotto?")) {
    fetch(`${productsURL}${id}`, {
      method: "DELETE",
      headers: {
        Authorization: productKey,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Prodotto cancellato con successo");
          getProducts();
        } else {
          throw new Error("Errore nella cancellazione del prodotto");
        }
      })
      .catch((err) => {
        console.log("C'è un errore", err);
      });
  }
};

// Carica i prodotti all'avvio della pagina
document.addEventListener("DOMContentLoaded", function () {
  getProducts();
});
