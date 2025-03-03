const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(cors());

// Route Imports
const authRoutes = require("./routes/authRoutes");
const boxerRoutes = require("./routes/boxerRoutes");
const trainerRoutes = require("./routes/trainerRoutes"); // ✅ Ensure Trainer Routes is included
const sessionRoutes = require("./routes/sessionRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const iotRoutes = require("./routes/iotRoutes");

// Route Definitions
app.use("/api/auth", authRoutes);
app.use("/api/boxer", boxerRoutes);
app.use("/api/trainer", trainerRoutes); // ✅ Corrected trainer route registration
app.use("/api/sessions", sessionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/iot", iotRoutes);

// Default Route
app.get("/api", (req, res) => {
  res.json({ message: "✅ API is running" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
