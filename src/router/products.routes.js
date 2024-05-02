const { Router } = require("express");
const fs = require("fs");
const path = require("path");

const { upload } = require("../lib/images");

const ProductManager = require("../ProductManager");

const router = Router();

const productManager = new ProductManager(
  path.join(__dirname, "../../productos.json")
);

router.get("/api/products", async (req, res) => {
  const { limit } = req.query;

  const products = await productManager.getProducts(limit);

  return res.status(200).json(products);
});

router.get("/api/products/:pid", async (req, res) => {
  const { pid } = req.params;

  const product = await productManager.getProductById(pid);

  if (!product) {
    return res.status(400).json({ message: "Product does not exists" });
  }

  return res.status(200).json(product);
});

router.post("/api/products", upload.array("files", 10), async (req, res) => {
  const { title, description, code, price, status, stock, category } = req.body;

  const products = await fs.readFileSync(
    path.join(__dirname, "../../productos.json"),
    "utf8"
  );
  const allProducts = JSON.parse(products);

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ message: "There are empty fields" });
  }

  const codeExists = allProducts.find((prod) => prod.code === code);

  if (codeExists) {
    return res.status(400).json({ message: "Code already exists" });
  }

  let routeImages = [];

  if (req.files) {
    for (let i = 0; i < req.files.length; i++) {
      routeImages.push(req.files[i].path);
    }
  }

  const showProducts = await productManager.addProduct({
    id:
      allProducts.length === 0 ? 1 : allProducts[allProducts.length - 1].id + 1,
    title,
    description,
    code,
    price,
    status: status === undefined ? true : status,
    stock,
    category,
    thumbnails: req.files ? routeImages : [],
  });

  global.io.emit("updateProducts", showProducts);

  return res.status(200).json({
    message: "Product added successfully",
    products: showProducts,
  });
});

router.put("/api/products/:pid", async (req, res) => {
  const { pid } = req.params;

  const productsUpdated = await productManager.updateProduct(pid, req.body);

  if (!productsUpdated) {
    return res.status(400).json({ message: "Product does not exists" });
  }

  return res.status(200).json({
    message: "Product updated succesfully",
    product: productsUpdated,
  });
});

router.delete("/api/products/:pid", async (req, res) => {
  const { pid } = req.params;

  const productRemoved = await productManager.deleteProduct(pid);

  if (!productRemoved) {
    return res.status(400).json({ message: "Product does not exists" });
  }

  global.io.emit("updateProducts", productRemoved);

  return res.status(200).json({ message: "Product removed sucessfully" });
});

module.exports = router;
