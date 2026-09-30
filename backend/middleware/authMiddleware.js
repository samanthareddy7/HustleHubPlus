/*
Author: Stack Overflow
Date Accessed: 30 August 2026
Link: https://stackoverflow.com/questions/31309759/what-is-secret-key-for-jwt-based-authentication-and-how-to-generate-it
Reason: Used to understand the purpose of the JWT secret key for signing and verifying tokens and keeping the secret securely stored on the server.
*/
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const JWT_ISSUER = process.env.JWT_ISSUER || "hustlehub-api";

const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "hustlehub-client";

// Middleware that verifies the JWT Bearer token, rejects missing, malformed, invalid
// or expired tokens with 401 and attaches the decoded user payload to req.user for protected routes.
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Authentication token is missing or malformed");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET,
      { 
        algorithms: ["HS256"],
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE
      }
    );
    req.user = decoded; 
    next();
  } catch (err) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    next(error);
  }
};

module.exports = authMiddleware;