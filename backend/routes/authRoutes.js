const express = require("express");

const {
  login,
  register
} = require("../controllers/authController");

const {
  registerValidationRules,
  loginValidationRules,
  handleValidationErrors
} = require("../middleware/validateAuth");

const router = express.Router();

router.post(
  "/register",
  registerValidationRules,
  handleValidationErrors,
  register
);

router.post(
  "/login",
  loginValidationRules,
  handleValidationErrors,
  login
);

// Protected routes are added here [Muhammad & Abdullah]

module.exports = router;