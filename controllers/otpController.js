const axios = require('axios');
const User = require('../models/User');
const API_KEY = process.env.OTP_SECRET_KEY;

// ✅ SEND OTP
const sendOtpSignup = async (req, res) => {
  try {
    const { username, phone } = req.body;

    if (!username || !phone) {
      return res.status(400).json({ message: 'Phone and username required' });
    }

    const response = await axios.get(
      `https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/AUTOGEN`
    );

    const sessionId = response.data.Details;

    console.log(`[2FA DEBUG] OTP sent to ${phone} with sessionId: ${sessionId}`);

    return res.status(200).json({ message: 'OTP sent successfully', sessionId });
  } catch (err) {
    console.error('[2FA SEND ERROR]', err.response?.data || err.message);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// ✅ VERIFY OTP
const verifyOtpSignup = async (req, res) => {
  try {
    console.log('[VERIFY OTP DEBUG] Request body:', req.body);

    const { username, phone, otp, sessionId } = req.body;

    if (!username || !phone || !otp || !sessionId) {
      return res.status(400).json({ message: 'Phone, OTP code, username, and sessionId required' });
    }

    const verifyUrl = `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;
    const response = await axios.get(verifyUrl);

    if (response.data.Details !== 'OTP Matched') {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = new User({
        username,
        phone,
        sessionBalance: 1,
        type: 'trial',
        joinDate: new Date(),
      });

      await user.save();
      console.log(`[VERIFY OTP] New user created: ${username}`);
    } else {
      console.log(`[VERIFY OTP] Existing user found: ${username}`);
    }

    const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET_KEY,
  { expiresIn: '7d' }
);

return res.status(200).json({ user, token });

  } catch (err) {
    console.error('[2FA VERIFY ERROR]', err.response?.data || err.message);
    return res.status(500).json({ message: 'OTP verification failed' });
  }
};

module.exports = {
  sendOtpSignup,
  verifyOtpSignup,
};
