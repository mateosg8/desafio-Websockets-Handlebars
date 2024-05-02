const express = require("express");
const http = require("http");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io");
const path = require("path");

const ProductManager = require("./ProductManager");

const { port } = require("./config/config");

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "./views"));

app.use(express.json());

app.use(require("./router/index.routes"));
app.use(require("./router/products.routes"));

app.use(express.static(path.join(__dirname, "../public")));

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log("Server running");
});

const productManager = new ProductManager(
  path.join(__dirname, "../productos.json")
);

// SOCKETS

const io = new Server(httpServer);

global.io = io;

io.on("connection", async (socket) => {
  console.log("You are connected!");

  socket.on("products", (products) => {
    console.log(products);
  });

  socket.on("removeProduct", async (id) => {
    const products = await productManager.deleteProduct(id.slice(6, id.lenght));
    io.emit("updateProducts", products);
  });
});
