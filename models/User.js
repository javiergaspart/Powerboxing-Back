const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    required: false, // ✅ FIXED: make email optional
    unique: false,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  profileImage: { 
    type: String 
  },
  membershipType: { 
    type: String,
  }, 
  joinDate: {
    type: Date,
    default: Date.now,
  },
  newcomer: {
    type: Boolean,
    default: true,
  },
  sessionBalance: {
    type: Number,
    default: 1,
  },
  lastLogin: {
    type: Date,
  },
  resetPasswordToken: { 
    type: String,
  },
  resetPasswordExpires: { 
    type: Date,
  },
  resetOTP: {
    type: String,
    default: null,
  },
  otpExpires: {
    type: Date,
    default: null,
  },
});

// ✅ Hash password if present
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
