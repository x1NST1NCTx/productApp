const productModel = require('../models/productModel');

const createProduct = (product) => productModel.createProduct(product);

const getProducts = () => productModel.getProducts();

const getProductById = (id) => productModel.getProductById(id);

const updateProduct = (id, product) => productModel.updateProduct(id, product);

const deleteProduct = (id) => productModel.deleteProduct(id);

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
