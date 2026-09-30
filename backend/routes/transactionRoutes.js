const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const requireRole =
    require("../middleware/roleMiddleware");

const {
    getFreelancerIncome
} = require("../controllers/transactionController");


router.get(
    "/income",
    authMiddleware,
    requireRole("freelancer"),
    getFreelancerIncome
);


module.exports = router;