const userModel = require('../models/userModel');

const createUser = (email, password_hash) => userModel.createUser(email, password_hash);

const getUsers = () => userModel.getUsers();

const getUserById = (id) => userModel.getUserById(id);

const updateUser = (id, email, password_hash) => userModel.updateUser(id, email, password_hash);

const deleteUser = (id) => userModel.deleteUser(id);

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
