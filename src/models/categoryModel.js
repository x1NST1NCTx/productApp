const pool = require('../config/db');

const createCategory = async (name) => {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query('INSERT INTO categories(name) VALUES (?)', [name]);
    return result.insertId;
  } finally {
    conn.release();
  }
};

const getCategories = async () => {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query('SELECT * FROM categories ORDER BY id ASC');
    return rows;
  } finally {
    conn.release();
  }
};

const getCategoryById = async (id) => {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  } finally {
    conn.release();
  }
};

const updateCategory = async (id, name) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
  } finally {
    conn.release();
  }
};

const deleteCategory = async (id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('DELETE FROM categories WHERE id = ?', [id]);
  } finally {
    conn.release();
  }
};


module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
