/*
Author: Tutorialspoint
Date Accessed: 11 October 2026
Link: https://www.tutorialspoint.com/expressjs/expressjs_routing.htm
Reason: Used to define the client and freelancer booking routes using HTTP methods and route parameters.
*/

const express = require("express");

const router = express.Router();

const { bookingLimiter } = require("../middleware/rateLimiters");

const authMiddleware =
    require("../middleware/authMiddleware");

const requireRole =
    require("../middleware/roleMiddleware");

const {
    createBookingValidationRules,
    bookingIdValidationRules,
    handleBookingValidationErrors
} = require("../middleware/validateBooking");

const {
    createBooking,
    getMyBookings,
    getFreelancerBookings,
    completeBooking
} = require("../controllers/bookingController");

// Client routes
router.post(
    "/",
    bookingLimiter,
    authMiddleware,
    requireRole("client"),
    createBookingValidationRules,
    handleBookingValidationErrors,
    createBooking
);


router.get(
    "/mine",
    authMiddleware,
    requireRole("client"),
    getMyBookings
);

//freelancer routes
router.get(
    "/freelancer",
    authMiddleware,
    requireRole("freelancer"),
    getFreelancerBookings
);


router.patch(
    "/:id/complete",
    authMiddleware,
    requireRole("freelancer"),
    bookingIdValidationRules,
    handleBookingValidationErrors,
    completeBooking
);


module.exports = router;