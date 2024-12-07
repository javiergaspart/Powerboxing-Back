// src/routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/create-payment', paymentController.createPayment);
router.post('/payment-success', paymentController.paymentSuccess); // Handle success notification

module.exports = router;
