const pool = require('../config/db');

const createUser = async (email, password_hash) => {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      'INSERT INTO users(email, password_hash) VALUES (?, ?)',
      [email, password_hash]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
};

const getUsers = async () => {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query('SELECT * FROM users ORDER BY id ASC');
    return rows;
  } finally {
    conn.release();
  }
};

const getUserById = async (id) => {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  } finally {
    conn.release();
  }
};

const updateUser = async (id, email, password_hash) => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      'UPDATE users SET email = ?, password_hash = ? WHERE id = ?',
      [email, password_hash, id]
    );
  } finally {
    conn.release();
  }
};

const deleteUser = async (id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('DELETE FROM users WHERE id = ?', [id]);
  } finally {
    conn.release();
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
