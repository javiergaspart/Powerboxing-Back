// src/services/authService.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const registerUser = async (userData) => {
  const { username, email, password } = userData;
  console.log('Registering user with data:', userData);

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('Registration failed: User already exists');
    throw new Error('User already exists');
  }

  // Check if the password is provided
  if (!password) {
    console.log('Registration failed: Password is required');
    throw new Error('Password is required');
  }

   // Check if password is provided and meets length requirement
   if (password.length < 6) {
    console.log('Registration failed: Password must be at least 6 characters long');
    throw new Error('Password must be at least 6 characters long');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Password hashed successfully');

  console.log('bcrypt version:', bcrypt.version);

  // Create new user
  const user = new User({
    username,
    email,
    password: hashedPassword,
    phone:'0',
    profileImage: ' ',
    membershipType: 'basic', // Default membership type
    joinDate: new Date(), // Set join date
    newcomer: true, // Mark as a new user
    sessionBalance: 1, // Give 1 session by default
  });

  await user.save();
  console.log('User registered successfully:', user);
  return user;
};

const loginUser = async (email, password) => {
  console.log('Logging in user with email:', email);
  console.log(password + " pass");

  const user = await User.findOne({ email });
  if (!user) {
    console.log('Login failed: Invalid email or password');
    throw new Error('Invalid email or password');
  }

  console.log('user pass: ' + user.password);

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) console.log(err);
    else {
      console.log("Rehashed password:", hash);
      console.log("Is the rehashed password equal to the stored hash?", hash === user.password);
    }
  });

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      console.log('Error comparing passwords:', err);
    } else {
      console.log('Password comparison result:', result);  // Should be true if the password matches
    }
  });
  
  const isMatch = bcrypt.compare(password, user.password);

  if (!isMatch) {
    console.log('Password comparison result:', isMatch);
    console.log('Login failed: Invalid password');
    throw new Error('Invalid email or password');
  }


  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  console.log('Login successful, token generated:', token);
  console.log('User ', user);

  return { token, user };
};

const forgotPassword = async (email) => {
  console.log('Initiating forgot password process for:', email);

  const user = await User.findOne({ email });
  if (!user) {
    console.log('Forgot password failed: Email not registered');
    throw new Error('Email not registered');
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Store the hashed token and expiry in the database
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
  await user.save();

  console.log('Reset token generated and stored:', resetToken);

  // Send email with reset token
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL, // Your email
      pass: process.env.EMAIL_PASSWORD, // Your email password
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const message = `You have requested a password reset. Click the link to reset your password: ${resetUrl}`;
  
  await transporter.sendMail({
    to: email,
    subject: 'Password Reset',
    text: message,
  });

  console.log('Reset password email sent to:', email);
};

const resetPassword = async (token, newPassword) => {
  console.log('Resetting password with token:', token);

  if (newPassword.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters long' };
  }

  // Hash the token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user by token and check if token is still valid
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    console.log('Reset password failed: Invalid or expired token');
    throw new Error('Invalid or expired token');
  }

  // Update the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  console.log('Password reset successfully for user:', user.email);
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
