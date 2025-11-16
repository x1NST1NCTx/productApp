const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const productBulkController = require('../controllers/productBulkController');

router.post('/bulk-upload', upload.single('file'), productBulkController.bulkUpload);

module.exports = router;
