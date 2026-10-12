/*
Author: GeeksforGeeks
Date Accessed: 30 August 2026
Link: https://www.geeksforgeeks.org/web-tech/json-web-token-jwt/
Reason: Used to understand and implement JWT-based authentication, including creating signed tokens with user claims and token expiration.
*/

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

const JWT_ISSUER = process.env.JWT_ISSUER || "hustlehub-api";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "hustlehub-client";

//Generates a signed JWT for an authenticated user.
const generateToken = (user) => {
  if (!JWT_SECRET) {
    const error = new Error("JWT secret is not configured on the server");
    error.statusCode = 500;
    throw error;
  }

  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN,
      algorithm: "HS256", 
      issuer: JWT_ISSUER, 
      audience: JWT_AUDIENCE }
  );
};

module.exports = generateToken;