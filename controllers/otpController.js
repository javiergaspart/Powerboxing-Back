const axios = require('axios');
const User = require('../models/User');

const OTP_API_KEY = process.env.OTP_SECRET_KEY;
const TWO_FACTOR_BASE = 'https://2factor.in/API/V1';

exports.sendOtpSignup = async (req, res) => {
  const { phone, username } = req.body;

  if (!phone || !username) {
    return res.status(400).json({ message: 'Phone and username required' });
  }

  try {
    // ✅ Block sending OTP to already signed-up users
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already signed up with this phone number' });
    }

    const url = `${TWO_FACTOR_BASE}/${OTP_API_KEY}/SMS/${phone}/AUTOGEN`;
    const response = await axios.get(url);
    const { Status, Details } = response.data;

    if (Status === 'Success') {
      return res.status(200).json({ message: 'OTP sent successfully', sessionId: Details });
    } else {
      return res.status(400).json({ message: 'Failed to send OTP', error: response.data });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

exports.verifyOtpSignup = async (req, res) => {
  const { phone, otp, username, sessionId } = req.body;

  if (!phone || !otp || !username || !sessionId) {
    return res.status(400).json({ message: 'Phone, OTP code, sessionId, and username required' });
  }

  try {
    const url = `${TWO_FACTOR_BASE}/${OTP_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;
    const response = await axios.get(url);
    const { Status } = response.data;

    if (Status !== 'Success') {
      return res.status(400).json({ message: 'OTP verification failed', error: response.data });
    }

    // ✅ Block duplicate user creation
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already signed up with this phone number' });
    }

    // ✅ Create trial user
    const newUser = new User({
      username,
      phone,
      joinDate: new Date(),
      type: 'trial',
      sessionBalance: 1,
    });

    await newUser.save();

    return res.status(200).json({ user: newUser, token: 'mock_token' });
  } catch (error) {
    return res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};
