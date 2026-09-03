/*
Author: Stack Overflow
Date Accessed: 30 August 2026
Link: https://stackoverflow.com/questions/31309759/what-is-secret-key-for-jwt-based-authentication-and-how-to-generate-it
Reason: Used to understand the purpose of the JWT secret key for signing and verifying tokens and keeping the secret securely stored on the server.
*/
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware that verifies the JWT Bearer token, rejects missing, malformed, invalid
// or expired tokens with 401 and attaches the decoded user payload to req.user for protected routes.
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Authentication token is missing or malformed");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    next(error);
  }
};

module.exports = authMiddleware;