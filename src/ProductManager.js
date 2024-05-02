const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(fields) {
    const products = await fs.readFileSync(this.path, "utf8");
    const allProducts = JSON.parse(products);

    allProducts.push(fields);

    await fs.writeFileSync(this.path, JSON.stringify(allProducts));

    return allProducts;
  }

  async getProducts(limit) {
    const products = await fs.readFileSync(this.path, "utf8");
    const allProducts = JSON.parse(products);

    if (limit) {
      return allProducts.slice(0, limit);
    }

    return allProducts;
  }

  async getProductById(id) {
    const products = await fs.readFileSync(this.path, "utf8");
    const allProducts = JSON.parse(products);

    const product = allProducts.find((prod) => prod.id === Number(id));

    if (!product) {
      return;
    }

    return product;
  }

  async updateProduct(id, fields) {
    const products = await fs.readFileSync(this.path, "utf8");
    const allProducts = JSON.parse(products);

    const product = allProducts.find((prod) => prod.id === Number(id));

    if (!product) {
      return;
    }

    for (const key of Object.keys(fields)) {
      product[key] = fields[key];
    }

    const productsUpdated = JSON.parse(products).map((prod) =>
      prod.id === Number(id) ? product : prod
    );
    await fs.writeFileSync(this.path, JSON.stringify(productsUpdated));

    return productsUpdated;
  }

  async deleteProduct(id) {
    const products = await fs.readFileSync(this.path, "utf8");
    const allProducts = JSON.parse(products);

    const product = allProducts.find((prod) => prod.id === Number(id));

    if (!product) {
      return;
    }

    const productRemoved = JSON.parse(products).filter(
      (prod) => prod.id !== Number(id)
    );
    await fs.writeFileSync(this.path, JSON.stringify(productRemoved));

    return productRemoved;
  }
}

module.exports = ProductManager;
