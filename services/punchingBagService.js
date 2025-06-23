// src/services/punchingBagService.js

const PunchingBag = require('../models/PunchingBag');

const createPunchingBag = async (location) => {
  console.log('Creating a new punching bag with location:', location);
  
  const punchingBag = new PunchingBag({ location });
  await punchingBag.save();
  
  console.log('Punching bag created successfully:', punchingBag);
  return punchingBag;
};

const getPunchingBags = async () => {
  console.log('Fetching all punching bags');
  
  const punchingBags = await PunchingBag.find();
  
  console.log('Retrieved punching bags:', punchingBags);
  return punchingBags;
};

const updatePunchingBagStatus = async (id, status) => {
  console.log(`Updating punching bag status. ID: ${id}, New Status: ${status}`);
  
  const updatedPunchingBag = await PunchingBag.findByIdAndUpdate(id, { status }, { new: true });
  
  if (!updatedPunchingBag) {
    console.log(`Punching bag with ID: ${id} not found`);
    throw new Error('Punching bag not found');
  }

  console.log('Punching bag status updated successfully:', updatedPunchingBag);
  return updatedPunchingBag;
};

module.exports = {
  createPunchingBag,
  getPunchingBags,
  updatePunchingBagStatus,
};
