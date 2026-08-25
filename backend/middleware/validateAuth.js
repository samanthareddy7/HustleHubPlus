const { body, validationResult } = require("express-validator");

//validation rules for usernames
const registerValidationRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),

    //validation rules for email including normalising to lowercase
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("A valid email address is required")
    .normalizeEmail(),

    //validation rules for password with regex checking. Must have 8 characters 
    //at least 1 uppercase letter, lowercase letter, special character and number
  body("password")
  .notEmpty().withMessage("Password is required")
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
  .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
  .matches(/\d/).withMessage("Password must contain at least one number")
  .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least one special character"),

  //specified roles for the system
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

// stops the request with a 400 before it reaches the controller
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
