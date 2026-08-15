const express = require("express");

const {
  login,
  register,
  getProfile
} = require("../controllers/authController");

const {
  registerValidationRules,
  loginValidationRules,
  handleValidationErrors
} = require("../middleware/validateAuth");

const authMiddleware = require("../middleware/authMiddleware");

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

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

module.exports = router;

