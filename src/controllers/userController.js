// src/controllers/userController.js

const userService = require('../services/userService');

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
};

const updateUserLastLogin = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserLastLogin(req.params.id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserById,
  updateUserLastLogin,
  getAllUsers,
};
