const express = require("express");

const router = express.Router();

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

//client routes
router.post(
    "/",
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