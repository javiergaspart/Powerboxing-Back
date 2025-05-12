const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');

router.post('/purchase', membershipController.buySessions);

module.exports = router;
