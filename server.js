const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected...");
    } catch (error) {
        console.error("🔴 MongoDB Connection Error:", error);
        process.exit(1);
    }
};

// Initialize Express App
const app = express();
app.use(express.json());
app.use(cors());

// Connect to Database
connectDB();

// Import Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/trainer", require("./routes/trainerRoutes"));
app.use("/api/sessions", require("./routes/sessionRoutes"));
app.use("/api/boxer", require("./routes/boxerRoutes"));

// Default Route
app.get("/", (req, res) => {
    res.send("🚀 PowerBoxing API is Running...");
});

// Handle 404 Errors
app.use((req, res) => {
    res.status(404).json({ message: "❌ Route Not Found" });
});

// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
