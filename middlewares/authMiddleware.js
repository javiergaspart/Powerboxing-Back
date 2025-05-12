const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log("DEBUG: Token received =", token);

    if (err){
      console.log("error: "+ err);
      return res.status(403).json({ message: 'Invalid or expired token' });
    } 
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
