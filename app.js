// src/app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // ✅ CORS module

const authRoutes = require('./routes/authRoutes');
const punchingBagRoutes = require('./routes/punchingBagRoutes');
const resultRoutes = require('./routes/resultsRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const trainerRoutes = require('./routes/trainerRoutes');

dotenv.config();

const app = express();
const path = require('path');

// ✅ MANUAL CORS FIX FOR BROWSER SUPPORT
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // You can restrict to 'http://localhost:5173' if needed
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// ✅ Enable CORS middleware
app.use(cors());

// ✅ Parse incoming JSON
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("\x1b[32m" + `Successfully connected to mongoDB at Port: ${process.env.PORT}` + "\x1b[0m");
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// ✅ Welcome route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to My Node.js Backend!</h1>');
});

// ✅ API route setup
app.use('/fitboxing/auth', authRoutes);
app.use('/fitboxing/punching-bags', punchingBagRoutes);
app.use('/fitboxing/results', resultRoutes);
app.use('/fitboxing/sensors', sensorRoutes);
app.use('/fitboxing/sessions', sessionRoutes);
app.use('/fitboxing/users', userRoutes);
app.use('/fitboxing/payments', paymentRoutes);
app.use('/fitboxing/password', passwordRoutes);
app.use('/fitboxing/membership', membershipRoutes);
app.use('/fitboxing/trainer', trainerRoutes);

// ✅ Serve static files
app.use('/fitboxing/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
