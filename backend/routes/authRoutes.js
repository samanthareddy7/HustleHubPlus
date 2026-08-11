const express = require("express");

const {
    login,
    register
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// profile route is added once JWT middleware protects it — Muhammad & Abdullah

module.exports = router;