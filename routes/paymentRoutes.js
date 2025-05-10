const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create a new Razorpay payment order
router.post('/create-payment', paymentController.createPayment);

// Verify Razorpay signature after successful payment
router.post('/verify-payment', paymentController.verifyPayment);

module.exports = router;
