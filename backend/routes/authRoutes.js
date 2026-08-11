const express = require("express");

const {
  login,
  register
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

// TEMPORARY used only to test JWT middleware.
//  Muhammad & Abdullah remove this implement protected routes 

router.get("/test-protected", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Token verified successfully",
    user: req.user
  });
});

module.exports = router;