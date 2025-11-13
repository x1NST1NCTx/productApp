const express = require('express');
const app = express();

// JSON and URL-encoded body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

module.exports = app;
