const ExcelJS = require('exceljs');
const productService = require('../services/productService');

const exportProductsExcel = async (req, res) => {
  try {
    const products = await productService.getProducts();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    // Define columns
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Image URL', key: 'image_url', width: 50 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Category ID', key: 'category_id', width: 15 }
    ];

    // Add rows
    products.forEach(product => {
      worksheet.addRow(product);
    });

    // Streaming response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="products_report.xlsx"');

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const exportProductsCSV = async (req, res) => {
  try {
    const products = await productService.getProducts();

    // Convert to CSV string
    const headers = ['ID', 'Name', 'Image URL', 'Price', 'Category ID'];
    const csvRows = [
      headers.join(','),
      ...products.map(p => `${p.id},"${p.name}","${p.image_url}",${p.price},${p.category_id}`)
    ];

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment;filename=products_report.csv');
    res.send(csvContent);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  exportProductsExcel,
  exportProductsCSV,
};
