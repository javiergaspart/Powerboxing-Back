const otpGenerator = require('otp-generator');
const twilio = require('twilio');
const User = require('../models/User');
const Otp = require('../models/Otp'); // Create an OTP model
require('dotenv').config();

// Twilio config (Use your Twilio credentials)
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Generate and send OTP
const sendOTP = async (phone) => {
    const user = await User.findOne({ phone });

    if (!user) {
        throw new Error("Phone number not linked to any account.");
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

    // Save OTP in DB (with expiry)
    await Otp.create({ phone, otp, expiresAt: Date.now() + 300000 }); // Expires in 5 minutes

    // Send OTP via Twilio
    await client.messages.create({
        body: `Your OTP for login is ${otp}. It is valid for 5 minutes.`,
        from: TWILIO_PHONE_NUMBER,
        to: phone
    });

    return { message: "OTP sent successfully" };
};

const verifyOTP = async (phone, otp) => {
    const otpRecord = await Otp.findOne({ phone }).sort({ createdAt: -1 });

    if (!otpRecord || otpRecord.otp !== otp) {
        throw new Error("Invalid or expired OTP.");
    }

    // Find user
    const user = await User.findOne({ phone });
    if (!user) {
        throw new Error("User not found.");
    }

    // 🔥 Debugging step - Log user details
    console.log("User found:", user);

    // If username is required but missing, handle gracefully
    if (!user.username) {
        throw new Error("Username is required but missing.");
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token, user };
};

module.exports = { sendOTP, verifyOTP };
