const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const productReportController = require('../controllers/productReportController')

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/search',productController.searchProducts);      
router.get('/:id', productController.getProductById);
router.patch('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/report/csv', productReportController.downloadCSVReport);
router.get('/report/xlsx', productReportController.downloadXLSXReport);


module.exports = router;
