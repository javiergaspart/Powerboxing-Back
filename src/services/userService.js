// src/services/userService.js

const User = require('../models/User');

const getUserById = async (id) => {
  return await User.findById(id);
};

const updateUserLastLogin = async (id) => {
  return await User.findByIdAndUpdate(id, { lastLogin: Date.now() }, { new: true });
};

const getAllUsers = async () => {
  return await User.find();
};

module.exports = {
  getUserById,
  updateUserLastLogin,
  getAllUsers,
};
