// src/routes/resultRoutes.js

const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultsController');

router.post('/', resultsController.savePunchResult);
router.get('/session/:sessionId', resultsController.getResultsBySession);

module.exports = router;
