const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

console.log('✅ Starting app.js, initializing routes...');

const authRoutes = require('./routes/authRoutes');
app.use('/fitboxing/auth', authRoutes);
console.log('✅ authRoutes loaded');

const trainerRoutes = require('./routes/trainerRoutes');
app.use('/fitboxing', trainerRoutes);
console.log('✅ trainerRoutes loaded');

const sessionRoutes = require('./routes/sessionRoutes');
app.use('/fitboxing', sessionRoutes);
console.log('✅ sessionRoutes loaded');

const userRoutes = require('./routes/userRoutes');
app.use('/fitboxing/users', userRoutes);
console.log('✅ userRoutes loaded');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

module.exports = app;
