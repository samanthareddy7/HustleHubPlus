const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";


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
    { expiresIn: JWT_EXPIRES_IN }
  );
};

module.exports = generateToken;