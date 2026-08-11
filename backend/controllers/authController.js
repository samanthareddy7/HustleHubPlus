const bcrypt = require("bcrypt");

const { createUser, findUserByEmail, toSafeUser } = require("../models/user");
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

module.exports = {
  register,
  login
};