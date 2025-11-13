const fs = require('fs');
const csv = require('csv-parser');
const productService = require('../services/productService');
const pool = require('../config/db');

const getCategoryIdByName = async (categoryName, conn) => {
  const rows = await conn.query('SELECT id FROM categories WHERE name = ?', [categoryName]);
  return rows.length ? rows[0].id : null;
};

const bulkUpload = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File is required' });

  const results = [];
  const CHUNK_SIZE = 500;
  let chunk = [];

  const processChunk = async (chunk, conn) => {
    for (const product of chunk) {
      // Validate required fields
      if (!product.name || !product.price || !product.category_name) {
        throw new Error('Missing required product fields');
      }
      // Resolve category_id
      const categoryId = await getCategoryIdByName(product.category_name, conn);
      if (!categoryId) {
        throw new Error(`Category '${product.category_name}' does not exist`);
      }

      await conn.query(
        'INSERT INTO products(name, image_url, price, category_id) VALUES (?, ?, ?, ?)',
        [product.name, product.image_url || null, product.price, categoryId]
      );
    }
  };

  try {
    const conn = await pool.getConnection();
    const uploadResults = [];

    // Stream CSV parsing
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
          chunk.push(data);
          if (chunk.length === CHUNK_SIZE) {
            uploadResults.push(processChunk(chunk, conn));
            chunk = [];
          }
        })
        .on('end', () => {
          if (chunk.length > 0) {
            uploadResults.push(processChunk(chunk, conn));
          }
          resolve();
        })
        .on('error', reject);
    });

    await Promise.all(uploadResults);
    conn.release();
    fs.unlinkSync(req.file.path);
    res.json({ message: 'Bulk upload successful' });

  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  bulkUpload,
};
