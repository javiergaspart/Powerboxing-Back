// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:id', userController.getUserById);
router.put('/:id/last-login', userController.updateUserLastLogin);
router.get('/', userController.getAllUsers);
router.post('/upload-profile-image/:id', userController.upload.single('image'), userController.uploadProfileImage);
router.put('/updateProfile/:id', userController.updateProfile);
router.post('/direct-signup', userController.directSignUp);
router.get('/users/:id', userController.getUserById);

module.exports = router;
