const bcrypt = require("bcryptjs");

async function hashPassword() {
    const password = "trainer1234";  // Change this to your desired password
    const saltRounds = 10; // Standard strength

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Hashed Password:", hashedPassword);
}

hashPassword();
