// src/app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const punchingBagRoutes = require('./routes/punchingBagRoutes');
const resultRoutes = require('./routes/resultRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Route definitions
app.use('/api/auth', authRoutes);
app.use('/api/punching-bags', punchingBagRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the app for testing or further configuration
module.exports = app;
