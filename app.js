const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json()); // ✅ Required for req.body

const authRoutes = require('./routes/authRoutes');
app.use('/fitboxing/auth', authRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://0.0.0.0:${PORT}`);
      console.log('Successfully connected to mongoDB');
    });
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });
