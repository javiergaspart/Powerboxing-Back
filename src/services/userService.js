// src/services/userService.js

const User = require('../models/User');

const getUserById = async (id) => {
  console.log(`Fetching user with ID: ${id}`);
  const user = await User.findById(id);
  if (!user) {
    console.warn(`User with ID: ${id} not found.`);
  } else {
    console.log(`User retrieved: ${JSON.stringify(user)}`);
  }
  return user;
};

const updateUserLastLogin = async (id) => {
  console.log(`Updating last login for user with ID: ${id}`);
  const updatedUser = await User.findByIdAndUpdate(id, { lastLogin: Date.now() }, { new: true });
  if (!updatedUser) {
    console.warn(`User with ID: ${id} not found for last login update.`);
  } else {
    console.log(`User updated: ${JSON.stringify(updatedUser)}`);
  }
  return updatedUser;
};

const getAllUsers = async () => {
  console.log('Fetching all users');
  const users = await User.find();
  console.log(`Total users retrieved: ${users.length}`);
  return users;
};

module.exports = {
  getUserById,
  updateUserLastLogin,
  getAllUsers,
};
