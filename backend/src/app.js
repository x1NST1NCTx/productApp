const express = require('express');
const app = express();
const cors = require('cors');

// JSON and URL-encoded body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:4200',  // frontend origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true                  // if needed
}));

// BigInt serialization fix
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Routes
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/categories', categoryRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

const productBulkRoutes = require('./routes/productBulkRoutes');
app.use('/products', productBulkRoutes);

module.exports = app;
