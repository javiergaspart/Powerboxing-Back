const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Send OTP via 2Factor
exports.sendOtpSignup = async (req, res) => {
  try {
    const { username, phone } = req.body;
    console.log(`[SEND OTP DEBUG] name="${username}" phone="${phone}"`);

    if (!username || !phone) {
      return res.status(400).json({ message: 'Phone and username required' });
    }

    const sendUrl = `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${phone}/AUTOGEN`;
    const sendResponse = await axios.get(sendUrl);
    const data = sendResponse.data;

    if (data.Status !== 'Success') {
      return res.status(500).json({ message: 'Failed to send OTP', error: data.Details });
    }

    const sessionId = data.Details;
    console.log(`[2FA DEBUG] OTP sent to ${phone} with sessionId: ${sessionId}`);

    return res.status(200).json({ message: 'OTP sent successfully', sessionId });
  } catch (error) {
    console.error('[SEND OTP ERROR]', error.message || error);
    return res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

// Verify OTP via 2Factor and register user
exports.verifyOtpSignup = async (req, res) => {
  try {
    const { username, phone, otp, sessionId } = req.body;
    console.log(`VERIFY OTP DEBUG: name=${username} | phone=${phone} | otp=${otp} | sessionId=${sessionId}`);

    if (!username || !phone || !otp || !sessionId) {
      return res.status(400).json({ message: 'Phone, OTP code, username, and sessionId required' });
    }

    const verifyUrl = `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;
    const verifyResponse = await axios.get(verifyUrl);
    const data = verifyResponse.data;

    console.log('[VERIFY RESPONSE]', data);

    if (data.Status !== 'Success') {
      return res.status(401).json({ message: 'OTP verification failed' });
    }

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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error('[VERIFY OTP ERROR]', error.message || error);
    return res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
};
