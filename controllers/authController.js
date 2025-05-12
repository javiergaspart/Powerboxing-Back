// src/controllers/authController.js

const authService = require('../services/authService');

const registerUser = async (req, res) => {
  console.log("Inside");
  const { phone, email, username } = req.body;

  try {
    const result = await authService.register({ phone, email, username });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

  const register = async (req, res) => {
    try {
      const user = await authService.registerUser(req.body);

      // Exclude the password from the user object before sending it in the response
      const userWithoutPassword = {
        id: user._id,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage || '',
        membershipType: user.membershipType || 'basic',
      };

      res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Call the auth service to validate the user and generate a token
      const { token, user } = await authService.loginUser(email, password);
  
      // Format the user object to include only necessary fields
      const userWithoutPassword = {
        id: user._id, // Populate the user's MongoDB ObjectId
        email: user.email,
        username: user.username,
        profileImage: user.profileImage || '', // Default to an empty string if not present
        membershipType: user.membershipType || 'basic', // Default to 'basic' if not present
      };
  
      // Send the response with the token and formatted user object
      res.status(200).json({
        message: 'Login successful',
        token,
        user: userWithoutPassword, // Include formatted user data for frontend use
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(400).json({ error: error.message });
    }
  };
  
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.status(200).json({ message: 'Reset password email sent successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  register,
  login,
  forgotPassword,
  resetPassword,
};
