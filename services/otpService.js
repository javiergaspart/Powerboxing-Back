const otpGenerator = require('otp-generator');
const User = require('../models/User');
const axios = require('axios');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const API_KEY = process.env.API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

const sendOtpForSignup = async (phone) => {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      throw new Error('Phone number already registered');
    }
  
    const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/AUTOGEN`;
    const response = await axios.get(url);
    return response.data;
  };
  

// Generate and send OTP
const sendOTP = async (phone) => {
    const user = await User.findOne({ phone });

    if (!user) {
        throw new Error("Phone number not linked to any account.");
    }

    // Generate OTP
    const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/AUTOGEN`;
    const response = await axios.get(url);
    return response.data;
};


const verifyOTP = async (sessionId, otp, phone) => {
    
    const url = `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;
    const response = await axios.get(url);
    const user = await User.findOne({ phone });

    if (!user) {
        return {
          Status: 'Failure',
          message: 'User not found',
        };
      }

    if (response.data.Status === 'Success') {
        // You can use more fields if you want (like phone number from DB)
        const payload = {
          sessionId, // Or phone number if available
          verifiedAt: new Date(),
        };
    
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '365d' });
    
        return {
          Status: 'Success',
          token,
          user: {
            _id: user.id,
            phone: user.phone,
            name: user.name,
          },
        };
      } else {
        return {
          Status: 'Failure',
          message: 'Invalid OTP',
        };
      }
};

const verifySignupOTP = async (sessionId, otp) => {
    const url = `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;
    const response = await axios.get(url);
  
    if (response.data.Status === 'Success') {
      // Instead of user ID, sign something safe like sessionId or phone
      const payload = {
        sessionId,
        verifiedAt: new Date(),
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' }); // Short-lived token for signup
  
      return {
        Status: 'Success',
        message: 'OTP verified successfully',
        token, // Now you have a token to authorize the upcoming registration
      };
    } else {
      return {
        Status: 'Failure',
        message: response.data.Details || 'Invalid OTP',
      };
    }
  };
  

module.exports = {sendOtpForSignup, sendOTP, verifyOTP, verifySignupOTP};
