// src/server.js

const app = require('./app'); // Import the app
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set the port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
