// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:id', userController.getUserById);
router.put('/:id/last-login', userController.updateUserLastLogin);
router.get('/', userController.getAllUsers);

module.exports = router;
