const bcrypt = require('bcrypt');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const passwordService = {
  async changePassword(userId, currentPassword, newPassword) {
    try {

      console.log('Changing password for user:', userId);

      if (newPassword.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters long' };
      }

      const user = await User.findById(userId);
      if (!user) {
        console.log('User not found');
        return { success: false, message: 'User not found' };
      }

      console.log("currentPassword: "+ currentPassword);
      console.log("user pass: "+ user.password);
      const hashedPassword = await bcrypt.hash(currentPassword, 10);
      console.log(hashedPassword);

      const isMatch = await bcrypt.compare(currentPassword.trim(), user.password.trim());
      if (!isMatch) {
        console.log('Wrong password');
        return { success: false, message: 'Wrong password' };
      }

    //   const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      console.log('Password updated successfully');
      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error changing password:', error);
      return { success: false, message: 'Internal server error' };
    }
  },

  async sendResetOTP(email) {
    try {
      console.log('Sending OTP to email:', email);
      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found');
        return { success: false, message: 'User not found' };
      }

      const otp = crypto.randomInt(100000, 999999).toString();
      console.log('Generated OTP:', otp);
      user.resetOTP = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
      await user.save();
      console.log('OTP saved in database');

      // Send email with OTP
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
      });
      console.log('OTP email sent successfully');
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, message: 'Failed to send OTP' };
    }
  },

  async resetPassword(email, otp, newPassword) {
    try {
      console.log('Resetting password for email:', email, 'with OTP:', otp);
      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found');
        return { success: false, message: 'User not found' };
      }
      
      if (newPassword.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters long' };
      }
      
      console.log('Stored OTP in DB:', user.resetOTP);
      console.log('Received OTP from request:', otp);
      console.log('Stored expiry time:', user.otpExpires, 'Current time:', Date.now());
      
      if (user.resetOTP !== otp || user.otpExpires < Date.now()) {
        console.log('Invalid or expired OTP');
        return { success: false, message: 'Invalid or expired OTP' };
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetOTP = null;
      user.otpExpires = null;
      await user.save();
      console.log('Password reset successfully');
      return { success: true, message: 'Password reset successful' };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, message: 'Internal server error' };
    }
  },
};

module.exports = passwordService;
