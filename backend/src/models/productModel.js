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

const getProductsBatch = async (offset, limit) => {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(`SELECT name, image_url, price, category_id FROM products ORDER BY id ASC LIMIT ? OFFSET ?`,
      [limit,offset]
    );
    return rows;
  } finally {
    conn.release();
  }

};

const searchProducts = async (searchTerm, page = 1, pageSize = 10, priceOrder = 'asc',filterByCategory = false ) => {
  const term = `%${searchTerm.toLowerCase()}%`;
  const offset = (page - 1) * pageSize;

  // Validate and sanitize priceOrder
  const order = priceOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  console.log("fT",filterByCategory);

  const conn = await pool.getConnection();

  try {
    let rows;
    let countResult;

    if (filterByCategory) {
      // Search products where category name matches searchTerm
      rows = await conn.query(
        `SELECT p.*
         FROM products p
         JOIN categories c ON p.category_id = c.id
         WHERE LOWER(c.name) LIKE ?
         ORDER BY p.price ${order}
         LIMIT ? OFFSET ?`,
        [term, pageSize, offset]
      );

      countResult = await conn.query(
        `SELECT COUNT(*) as totalCount
         FROM products p
         JOIN categories c ON p.category_id = c.id
         WHERE LOWER(c.name) LIKE ?`,
        [term]
      );
    } else {
      // Search products by product name
      rows = await conn.query(
        `SELECT * FROM products
         WHERE LOWER(name) LIKE ?
         ORDER BY price ${order}
         LIMIT ? OFFSET ?`,
        [term, pageSize, offset]
      );

      countResult = await conn.query(
        `SELECT COUNT(*) as totalCount
         FROM products
         WHERE LOWER(name) LIKE ?`,
        [term]
      );
    }

    return {
      items: rows,
      totalCount: countResult[0].totalCount,
    };
  } finally {
    conn.release();
  } 
};


module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsBatch,
  searchProducts
};
