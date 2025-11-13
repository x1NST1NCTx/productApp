const categoryModel = require('../models/categoryModel');

const createCategory = (name) => categoryModel.createCategory(name);

const getCategories = () => categoryModel.getCategories();

const getCategoryById = (id) => categoryModel.getCategoryById(id);

const updateCategory = (id, name) => categoryModel.updateCategory(id, name);

const deleteCategory = (id) => categoryModel.deleteCategory(id);

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
