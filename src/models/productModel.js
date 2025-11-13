const pool = require('../config/db');

const createProduct = async (product) => {
  const { name, image_url, price, category_id } = product;
  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      `INSERT INTO products(name, image_url, price, category_id)
       VALUES (?, ?, ?, ?)`, 
      [name, image_url, price, category_id]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
};

const getProducts = async () => {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query('SELECT * FROM products ORDER BY id ASC');
    return rows;
  } finally {
    conn.release();
  }
};

const getProductById = async (id) => {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  } finally {
    conn.release();
  }
};

const updateProduct = async (id, product) => {
  const { name, image_url, price, category_id } = product;
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `UPDATE products SET name = ?, image_url = ?, price = ?, category_id = ? WHERE id = ?`,
      [name, image_url, price, category_id, id]
    );
  } finally {
    conn.release();
  }
};

const deleteProduct = async (id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('DELETE FROM products WHERE id = ?', [id]);
  } finally {
    conn.release();
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
