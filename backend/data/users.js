const crypto = require("crypto");
const users = require("../data/users");

const createUser = ({ name, email, passwordHash, role }) => {
  const newUser = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: role || "client",
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  return newUser;
};

const findUserByEmail = (email) => {
  if (!email) return undefined;
  return users.find((user) => user.email === email.toLowerCase());
};

const findUserById = (id) => {
  return users.find((user) => user.id === id);
};

// Strips the password hash before a user object is ever sent to the client
const toSafeUser = (user) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  toSafeUser
};