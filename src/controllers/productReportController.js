const fs = require('fs');
const path = require('path');
const fastCsv = require('fast-csv');
const ExcelJS = require('exceljs');
const { getProductsBatch } = require('../models/productModel');

// CSV report generation using streaming and batching
async function generateCSVReport(filePath) {
  
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const ws = fs.createWriteStream(filePath);
  const csvStream = fastCsv.format({ headers: true });
  csvStream.pipe(ws);

  const batchSize = 10000;
  let offset = 0;

  while (true) {
    const products = await getProductsBatch(offset, batchSize);
    console.log("products",products);
    if (products.length === 0) break;

    products.forEach(product => csvStream.write(product));
    offset += batchSize;
  }

  csvStream.end();

  return new Promise(resolve => ws.on('finish', resolve));
}

// XLSX report generation using streaming and batching
async function generateXLSXReport(filePath) {

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ filename: filePath });
  const sheet = workbook.addWorksheet('Products');

  sheet.addRow(['name', 'image_url', 'price', 'category_id']).commit();

  const batchSize = 1000;
  let offset = 0;

  while (true) {
    const products = await getProductsBatch(offset, batchSize);
    if (products.length === 0) break;

    products.forEach(product => {
      sheet.addRow([product.name, product.image_url, product.price, product.category_id]).commit();
    });

    offset += batchSize;
  }

  await workbook.commit();
}

// Express controller actions to trigger report generation and download
async function downloadCSVReport(req, res) {
  const filePath = path.join(__dirname, '../../reports/product_report.csv');
  await generateCSVReport(filePath);
  res.download(filePath);
}

async function downloadXLSXReport(req, res) {
  const filePath = path.join(__dirname, '../../reports/product_report.xlsx');
  await generateXLSXReport(filePath);
  res.download(filePath);
}

module.exports = { downloadCSVReport, downloadXLSXReport };
