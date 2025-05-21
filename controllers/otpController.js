const axios = require('axios');
const User = require('../models/User');

const verifyOtp = async (req, res) => {
  const { username, phone, otp, sessionId } = req.body;

  console.log(`[VERIFY OTP DEBUG] name=${username} | phone=${phone} | otp=${otp} | sessionId=${sessionId}`);

  if (!username || !phone || !otp || !sessionId) {
    console.error('[VERIFY OTP ERROR] Missing fields');
    return res.status(400).json({ message: 'Phone, OTP code, sessionId, and username required' });
  }

  try {
    const verifyResponse = await axios.get(
      `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
    );

    console.log('[VERIFY OTP DEBUG] 2Factor response:', verifyResponse.data);

    if (verifyResponse.data.Status === 'Success') {
      let user = await User.findOne({ phone });

      if (!user) {
        user = new User({
          username,
          phone,
          joinDate: new Date(),
          sessionBalance: 1,
          type: 'trial',
        });
        await user.save();
        console.log('[VERIFY OTP] New user created:', user._id);
      } else {
        console.log('[VERIFY OTP] Existing user:', user._id);
      }

      // ✅ Token can be added here if needed
      return res.status(200).json({
        message: 'OTP verified successfully',
        user,
        token: 'mock_token',
      });
    } else {
      return res.status(400).json({
        message: 'OTP verification failed',
        error: verifyResponse.data.Details || 'Unknown error',
      });
    }
  } catch (err) {
    console.error('[VERIFY OTP ERROR]', err.response?.data || err.message);
    return res.status(500).json({
      message: 'Server error during OTP verification',
      error: err.response?.data || err.message,
    });
  }
};

module.exports = { verifyOtp };
