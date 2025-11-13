const fs = require('fs');
const csv = require('csv-parser');
const pool = require('../config/db');
const { getCategoryByName } = require('../models/categoryModel');

const bulkUpload = async (req, res) => {
  const uploadFile = req.file;
  if (!req.file) return res.status(400).json({ error: 'File is required' });

  const chunkSize = 500;
  let chunk = [];
  let insertPromises = [];

  const processChunk = async (chunk, conn) => {
    for (const product of chunk) {
      if (!product.name || !product.price || !product.category_name) {
        throw new Error('Missing required product fields');
      }
      const category = await getCategoryByName(product.category_name, conn);
      console.log("category",category.name);
      if (!category.name) {
        throw new Error(`Category '${product.category_name}' does not exist`);
      }
      await conn.query(
        'INSERT INTO products(name, image_url, price, category_id) VALUES (?, ?, ?, ?)',
        [product.name, product.image_url || null, product.price, category.id]
      );
    }
  };

  try {
    const conn = await pool.getConnection();

    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
          chunk.push(data);
          if (chunk.length === chunkSize) {
            // Process and clear chunk asynchronously
            insertPromises.push(processChunk(chunk, conn));
            chunk = [];
          }
        })
        .on('end', () => {
          if (chunk.length > 0) {
            insertPromises.push(processChunk(chunk, conn));
          }
          resolve();
        })
        .on('error', reject);
    });

    // Await all chunk insertions
    await Promise.all(insertPromises);

    conn.release();
    fs.unlinkSync(req.file.path);

    res.json({ message: 'Bulk upload completed' });

  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  bulkUpload,
};
