const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyOtpSignup = async (req, res) => {
  try {
    const { username, phone, otp, sessionId } = req.body;

    console.log(`VERIFY OTP DEBUG: name=${username} | phone=${phone} | otp=${otp} | sessionId=${sessionId}`);

    if (!username || !phone || !otp || !sessionId) {
      return res.status(400).json({ message: 'Phone, OTP code, username, and sessionId required' });
    }

    const verifyUrl = `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;
    const verifyResponse = await axios.get(verifyUrl);
    console.log('✅ 2Factor VERIFY response:', verifyResponse.data);

    if (verifyResponse.data.Status !== 'Success') {
      return res.status(401).json({ message: 'OTP verification failed' });
    }

    // Create new user (or return existing if needed)
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({
        username,
        phone,
        joinDate: new Date(),
        sessionBalance: 1,
        type: 'trial',
        newcomer: true,
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d',
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error('[VERIFY OTP ERROR]', error.message || error);
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};
