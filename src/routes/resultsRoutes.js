// src/routes/resultRoutes.js

const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultsController');

router.post('/', resultsController.savePunchResult);
router.get('/session/:sessionId', resultsController.getResultsBySession);
router.post('/session/:sessionId/user/:userId', resultsController.updatePunchResult);


module.exports = router;
