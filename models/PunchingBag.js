const mongoose = require('mongoose');

const punchingBagSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'in_use', 'maintenance'],
    default: 'available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sensors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' }], // Reference to Sensor model
});

const PunchingBag = mongoose.model('PunchingBag', punchingBagSchema);
module.exports = PunchingBag;
