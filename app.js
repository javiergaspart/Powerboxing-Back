const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/fitboxing/auth', authRoutes);

// ✅ Trainer routes
const trainerRoutes = require('./routes/trainerRoutes');
app.use('/fitboxing', trainerRoutes);

// ✅ NEW: Sessions route added (for saveTrainerSlots)
const sessionRoutes = require('./routes/sessionRoutes');
app.use('/fitboxing/sessions', sessionRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

module.exports = app;
