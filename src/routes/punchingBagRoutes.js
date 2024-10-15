// src/routes/punchingBagRoutes.js

const express = require('express');
const router = express.Router();
const punchingBagController = require('../controllers/punchingBagController');

router.post('/', punchingBagController.createPunchingBag);
router.get('/', punchingBagController.getPunchingBags);
router.put('/:id/status/:status', punchingBagController.updatePunchingBagStatus);

module.exports = router;
