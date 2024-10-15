// src/services/punchingBagService.js

const PunchingBag = require('../models/PunchingBag');

const createPunchingBag = async (location) => {
  const punchingBag = new PunchingBag({ location });
  await punchingBag.save();
  return punchingBag;
};

const getPunchingBags = async () => {
  return await PunchingBag.find();
};

const updatePunchingBagStatus = async (id, status) => {
  return await PunchingBag.findByIdAndUpdate(id, { status }, { new: true });
};

module.exports = {
  createPunchingBag,
  getPunchingBags,
  updatePunchingBagStatus,
};
