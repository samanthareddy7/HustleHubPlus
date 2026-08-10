const mongoose = require("mongoose");

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

const createUser = async ({ name, email, passwordHash, role }) => {
  return User.create({ name, email, passwordHash, role });
};

const findUserByEmail = async (email) => {
  if (!email) return null;
  return User.findOne({ email: email.toLowerCase() });
};

const findUserById = async (id) => {
  return User.findById(id);
};

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
  toSafeUser
};