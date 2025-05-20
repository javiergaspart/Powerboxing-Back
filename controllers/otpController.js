// controllers/otpController.js

// Simulated in-memory OTP store (or replace with DB logic)
const otpStore = {};

exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Show OTP in Render logs
    console.log(`[OTP DEBUG] OTP for ${phone} is ${otp}`);

    // ✅ Store it in memory (TEMPORARY — for testing only)
    otpStore[phone] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // valid for 5 minutes
    };

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const entry = otpStore[phone];
    if (!entry) {
      return res.status(404).json({ message: 'OTP not found or expired' });
    }

    if (Date.now() > entry.expires) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (entry.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // ✅ OTP is valid
    return res.status(200).json({ message: 'OTP verified' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};
