/*
Author: Express.js
Date Accessed: 26 August 2026
Link: https://expressjs.com/en/guide/routing/ 
Reason: Used official documentation to add routing for server adn api endpoints
*/

const express = require("express");

const {
  login,
  register,
  getProfile,
  updateProfile
} = require("../controllers/authController");

const {
  registerValidationRules,
  loginValidationRules,
  updateProfileValidationRules,
  handleValidationErrors
} = require("../middleware/validateAuth");

const authMiddleware = require("../middleware/authMiddleware");
const {authLimiter} = require('../middleware/rateLimiters')

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  rejectUnexpectedFields(["name","email", "password","role"]),
  registerValidationRules,
  handleValidationErrors,
  register
);

router.post(
  "/login",
  authLimiter,
  loginValidationRules,
  handleValidationErrors,
  login
);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.patch(
  "/profile",
  authMiddleware,
  updateProfileValidationRules,
  handleValidationErrors,
  updateProfile
);

module.exports = router;

