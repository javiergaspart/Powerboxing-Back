const express = require("express");
const router = express.Router();
const authService = require("../services/authService");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { phone } = req.body;

  if (!phone || phone.length !== 10) {
    return res.status(400).json({ success: false, message: "Invalid phone number" });
  }

  try {
    const { user, token } = await authService.loginUser(phone);

    return res.status(200).json({
      success: true,
      user,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(404).json({ success: false, message: error.message });
  }
});

// Optional: POST /api/auth/register
router.post("/register", async (req, res) => {
  const { phone, name } = req.body;

  if (!phone || !name) {
    return res.status(400).json({ success: false, message: "Phone and name are required" });
  }

  try {
    const { user, token } = await authService.registerUser(phone, name);

    return res.status(201).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
