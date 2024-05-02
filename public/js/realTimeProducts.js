const socket = io();

socket.on("updateProducts", (products) => {
  socket.emit("products", products);

  const containerProducts = document.getElementById("products");

  containerProducts.innerHTML = "";

  products.forEach((product) => {
    containerProducts.innerHTML += `
        <ul class="container-product">
            <img src="${product.thumbnails[0]}" alt="product" />

            <p class="title">${product.title}</p>
            <p class="description">${product.description}</p>
            <p class="price">${product.price}</p>
    
            <button class="button-delete" id=remove${product.id} onclick="getButtonRemove('remove${product.id}')">
                Delete
            </button>
        </ul>
        `;
  });
});

function getButtonRemove(id) {
  const button = document.getElementById(id);

  button.addEventListener("click", () => {
    socket.emit("removeProduct", id);
  });
}
