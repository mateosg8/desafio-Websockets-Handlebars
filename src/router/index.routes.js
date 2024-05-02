const { Router } = require("express");
const path = require("path");

const ProductManager = require("../ProductManager");

const router = Router();

const productManager = new ProductManager(
  path.join(__dirname, "../../productos.json")
);

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();

  res.render("realTimeProducts", {
    layout: "home",
    products,
  });
});

module.exports = router;
