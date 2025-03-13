const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();  // Load environment variables

// Import routes
const sessionRoutes = require("./routes/sessionRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const boxerRoutes = require("./routes/boxerRoutes");
const authRoutes = require("./routes/authRoutes");  // Ensure this exists

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if DB fails
});

// ✅ Route mounting (Fixes 404 issues)
app.use("/api/sessions", sessionRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/boxers", boxerRoutes);
app.use("/api/auth", authRoutes);

// ✅ Test Route
app.get("/api/test", (req, res) => {
    res.send("✅ API is working!");
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
