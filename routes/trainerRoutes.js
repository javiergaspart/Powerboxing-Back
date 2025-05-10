const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');

router.post('/login', trainerController.loginTrainer);
// Later: router.post('/register', trainerController.registerTrainer);

module.exports = router;
