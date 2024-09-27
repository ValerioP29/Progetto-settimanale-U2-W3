const productsURL = "https://striveschool-api.herokuapp.com/api/product/";
const productKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY2NGU4MTc5YzQ1ZjAwMTU2OWI0YjMiLCJpYXQiOjE3Mjc0MTc5ODUsImV4cCI6MTcyODYyNzU4NX0.TWD_GpyfDeFyqreFAF5n_FZp3x76FaUpkX58UD5dz08";

const params = new URLSearchParams(window.location.search);
const productId = params.get("productId");

const getProductDetails = function () {
  fetch(`${productsURL}${productId}`, {
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
    .then((product) => {
      document.getElementById("productName").textContent = product.name;
      document.getElementById("productImage").src = product.imageUrl;
      document.getElementById("productDescription").textContent = product.description;
      document.getElementById("productPrice").textContent = `${product.price}€`;
      document.getElementById("productBrand").textContent = `Brand: ${product.brand}`;
    })
    .catch((err) => {
      console.log("ERRORE", err);
    });
};

getProductDetails();
