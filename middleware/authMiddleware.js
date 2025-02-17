const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = function (req, res, next) {
    try {
        console.log("🔹 Authorization Header:", req.header("Authorization"));

        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized - No token" });
        }

        const token = authHeader.split(" ")[1];
        console.log("🔹 Extracted Token:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Verified:", decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error("🔴 Token Verification Failed:", error.message);
        return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
};
