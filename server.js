// src/server.js

const app = require('./app'); // Import the app
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set the port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log("\x1b[32m"+ `Server is running on http://0.0.0.0:${PORT}`+ "\x1b[0m");
});

