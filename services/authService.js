const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Login using phone (no password)
const loginUser = async (phone) => {
  console.log('Logging in with phone:', phone);

  const user = await User.findOne({ phone });

  if (!user) {
    throw new Error('Phone number not registered');
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return { token, user };
};

// Register new user using phone and name
const registerUser = async (phone, name) => {
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    throw new Error('User already registered');
  }

  const newUser = new User({
    name,
    phone,
    type: 'trial',
    sessionBalance: 1,
    joinDate: new Date(),
    role: 'user',
    profileImage: '',
  });

  await newUser.save();

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return { token, user: newUser };
};

module.exports = {
  loginUser,
  registerUser,
};
