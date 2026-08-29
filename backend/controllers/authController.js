/*
Author: bcrypt npm package documentation
Date Accessed: 30 August 2026
Link: https://www.npmjs.com/package/bcrypt
Reason: Used to implement secure password hashing during user registration and password comparison during user login.
*/

/*
Author: Express.js
Date Accessed: 30 August 2026
Link: https://expressjs.com/en/guide/error-handling.html
Reason: Used to implement asynchronous error handling in Express route handlers with try/catch and next(err).
*/

/*
Author: shubham
Date Accessed: 30 August 2026
Link: https://medium.com/@s35919223/middleware-in-express-js-the-complete-deep-dive-c36c632d7824
Reason: Used to understand and implement Express.js middleware using req, res and next(), including authentication middleware that validates requests before allowing access to protected routes.
*/

// Imports bcrypt for securely hashing and comparing user passwords.
const bcrypt = require("bcrypt");

const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserName,
  toSafeUser
} = require("../models/user");

// Imports the function used to generate JWT authentication tokens.
const generateToken = require("../utils/generateToken");

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      const error = new Error("Name, email, and password are required");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      const error = new Error("An account with this email already exists");
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const newUser = await createUser({ name, email, passwordHash, role });

    return res.status(201).json({
      message: "User registered successfully",
      user: toSafeUser(newUser)
    });
  } catch (err) {
    next(err);
  }
};

// Authenticates a user by verifying their password and generating a JWT token on successful login.
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.statusCode = 400;
      throw error;
    }

    const user = await findUserByEmail(email);
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: toSafeUser(user)
    });
  } catch (err) {
    next(err);
  }
};

// Retrieves the authenticated user's profile using their verified JWT user ID.
const getProfile = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      const error = new Error("User account not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      message: "Profile retrieved successfully",
      user: toSafeUser(user)
    });
  } catch (err) {
    next(err);
  }
};

// Updates the authenticated user's name using the user ID from their verified JWT.
const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    const updatedUser = await updateUserName(req.user.id, name);

    if (!updatedUser) {
      const error = new Error("User account not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: toSafeUser(updatedUser)
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
