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


const uploadProfileImage = async (userId, imagePath) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: imagePath },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }
    console.log("Updated User", updatedUser);

    return updatedUser;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error('Image upload failed');
  }
};


async function updateUserProfile(userId, updatedData) {
  try {
      const user = await User.findById(userId);
      if (!user) return null;

      if (updatedData.username) user.username = updatedData.username;
      if (updatedData.email) user.email = updatedData.email;
      if (updatedData.phone) user.phone = updatedData.phone;
      if (updatedData.password) user.password = updatedData.password; // Ensure hashing
      if (updatedData.profileImage) user.profileImage = updatedData.profileImage;

      await user.save();
      return user;
  } catch (error) {
      console.error('Error updating user:', error);
      throw error;
  }
}


module.exports = {
  getUserById,
  updateUserLastLogin,
  getAllUsers,
  uploadProfileImage,
  updateUserProfile,
};
