const { body, validationResult } = require("express-validator");

const registerValidationRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("A valid email address is required")
    .normalizeEmail(),

  body("password")
  .notEmpty().withMessage("Password is required")
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
  .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
  .matches(/\d/).withMessage("Password must contain at least one number")
  .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least one special character"),

  body("role")
    .optional()
    .isIn(["client", "freelancer", "admin"]).withMessage("Role must be client, freelancer, or admin")
];

const loginValidationRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("A valid email address is required")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
];

const updateProfileValidationRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters")
    .matches(/^[\p{L}\s'-]+$/u).withMessage("Name may only contain letters, spaces, apostrophes, and hyphens")
];

// stops therequest with a 400 before it reaches the controller
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 400;
    return next(error);
  }

  next();
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  updateProfileValidationRules,
  handleValidationErrors
};
