const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// USER routes
router.post('/login', authController.userLogin);

// TRAINER login using GET and URL parameter
router.get('/trainer-login/:phone', authController.loginTrainerByPhoneParam);

module.exports = router;
