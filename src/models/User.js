const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true, // Auto-generate ID
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
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
  resetOTP: {  // Updated field
    type: String,
    default: null,
  },
  otpExpires: { // Updated field
    type: Date,
    default: null,
  },
});

// **Hash password before saving**
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
