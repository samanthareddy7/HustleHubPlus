/*
Author: Mastering JS
Date Accessed: 11 October 2026
Link: https://masteringjs.io/tutorials/express/router
Reason: Used to create an Express router and apply authentication and admin role middleware to all admin routes with router.use.
*/

const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const {
    gigIdValidationRules,
    handleGigValidationErrors
} = require("../middleware/validateGig");

const {
    getAllUsers,
    getAllBookings,
    getPlatformStats,
    deactivateGig,
    getAllGigs
} = require("../controllers/adminController");

// every admin route requires a valid JWT AND the admin role
router.use(authMiddleware, requireRole("admin"));

router.get("/users", getAllUsers);
router.get("/bookings", getAllBookings);
router.get("/stats", getPlatformStats);

router.patch(
    "/gigs/:id/deactivate",
    gigIdValidationRules,
    handleGigValidationErrors,
    deactivateGig
);
router.get("/gigs", getAllGigs);

module.exports = router;