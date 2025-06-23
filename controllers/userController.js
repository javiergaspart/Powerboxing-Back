// src/controllers/userController.js

const mongoose = require('mongoose');
const User = require('../models/User');  // Ajusta el path si el modelo está en otra carpeta

const userService = require('../services/userService');

const multer = require('multer');
const path = require('path');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File Filter (Accept Images Only)

const fileFilter = (req, file, cb) => {
  console.log("Received file:", file);
  console.log("Received file type:", file?.mimetype);

  if (!file) {
    return cb(new Error('No file received!'), false);
  }

  if (file.mimetype && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};


// Initialize Upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
});


const getUserById = async (req, res) => {
  try {
    console.debug('Entrada getUserById');

    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('❌ Error in getUserById:', err.message);
    res.status(500).json({ message: 'Internal server error' });
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

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, phone, password } = req.body;
    
    const updatedUser = await userService.updateUserProfile(userId, { username, email, phone, password });
    if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Profile updated successfully.", user: updatedUser });
} catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
}
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    console.log("Image Path: ", req.file.filename);
    const userId = req.params.id;
    const imagePath = `uploads/${req.file.filename}`; // Path to store in DB

    console.log("Image path", imagePath);
    const updatedUser = await userService.uploadProfileImage(userId, imagePath);
    res.status(200).json({ message: 'Profile image updated successfully', user: updatedUser });
    console.log("res status", res.statusCode );
    console.log(" Profile image updated successfully" + updatedUser );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getUserById,
  updateUserLastLogin,
  uploadProfileImage,
  updateProfile,
  getAllUsers,
  upload,
};
