const { getCategoryById } = require('../models/categoryModel');
const productService = require('../services/productService');

const createProduct = async (req, res) => {
  const { name, image_url, price, category_id } = req.body;

  if (!name || price == null || !category_id) {
    return res.status(400).json({ error: "Product name, price and category_id are required" });
  }

  const categoryExists = await getCategoryById(category_id);
  if (!categoryExists) {
    return res.status(400).json({ error: "Provided category_id does not exist" });
  }

  try {
    const id = await productService.createProduct({ name, image_url, price, category_id });
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productService.getProductById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, image_url, price, category_id } = req.body;

  if (!name || price == null || !category_id) {
    return res.status(400).json({ error: "Product name, price and category_id are required" });
  }

  const categoryExists = await getCategoryById(category_id);
  if (!categoryExists) {
    return res.status(400).json({ error: "Provided category_id does not exist" });
  }

  try {
    await productService.updateProduct(id, { name, image_url, price, category_id });
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await productService.deleteProduct(id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchProducts = async (req, res) => {
  const searchTerm = req.query.q?.trim();
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const priceOrder = req.query.priceOrder === 'desc' ? 'desc' : 'asc';
  const filterByCategory = req.query.filterByCategory === 'true';
  try {
    const results = await productService.searchProducts(searchTerm, page, pageSize, priceOrder, filterByCategory);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};



module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts
};
