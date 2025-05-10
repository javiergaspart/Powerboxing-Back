// src/controllers/punchingBagController.js

const punchingBagService = require('../services/punchingBagService');

const createPunchingBag = async (req, res) => {
  try {
    const punchingBag = await punchingBagService.createPunchingBag(req.body.location);
    res.status(201).json(punchingBag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPunchingBags = async (req, res) => {
  try {
    const punchingBags = await punchingBagService.getPunchingBags();
    res.status(200).json(punchingBags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePunchingBagStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    const updatedPunchingBag = await punchingBagService.updatePunchingBagStatus(id, status);
    res.status(200).json(updatedPunchingBag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createPunchingBag,
  getPunchingBags,
  updatePunchingBagStatus,
};
