const jwt = require('jsonwebtoken');

const secretKey = 'secretkey'; // Ensure this is the same key used to sign the token

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).send('Token is required');

  const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
  if (!token) return res.status(403).send('Token is required');

  jwt.verify(token, secretKey, (err, decode) => {
    if (err) return res.status(403).send('Failed to authenticate');

    req.decode = decode;
    next();
  });
};

module.exports = verifyToken;
