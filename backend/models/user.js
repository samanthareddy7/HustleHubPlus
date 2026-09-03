/*
Author: Mongoose
Date Accessed: 30 August 2026
Link: https://mongoosejs.com/docs/guide.html
Reason: Used to implement the MongoDB user model using Mongoose schemas, models and timestamps.
*/

const mongoose = require("mongoose");

// Imports Mongoose to define the user schema and interact with MongoDB.

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["client", "freelancer", "admin"], default: "client" }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Creates and saves a new user document in MongoDB.
const createUser = async ({ name, email, passwordHash, role }) => {
  return User.create({ name, email, passwordHash, role });
};

// Finds a user by email for login and duplicate-registration checks.
const findUserByEmail = async (email) => {
  if (!email) return null;
  return User.findOne({ email: email.toLowerCase() });
};

// Finds a user by their MongoDB ID for authenticated user lookups.
const findUserById = async (id) => {
  return User.findById(id);
};

const updateUserName = async (id, name) => {
  return User.findByIdAndUpdate(
    id,
    { name },
    {
      new: true,
      runValidators: true
    }
  );
};

// Removes sensitive fields before returning user data to the client.
const toSafeUser = (user) => {
  const userObject = user.toObject ? user.toObject() : user;
  const { passwordHash, __v, ...safeUser } = userObject;
  return safeUser;
};

module.exports = {
  User,
  createUser,
  findUserByEmail,
  findUserById,
  updateUserName,
  toSafeUser
};