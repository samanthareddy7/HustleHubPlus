const express = require("express");
const {
  login,
  register
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected routes are added here  — Muhammad & Abdullah

module.exports = router;