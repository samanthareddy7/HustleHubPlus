/*
Author: Express.js
Date Accessed: 11 October 2026
Link: https://expressjs.com/en/5x/api/router
Reason: Used to create the Express 5 router for the freelancer income endpoint.
*/

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