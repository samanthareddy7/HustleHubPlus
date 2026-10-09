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
    deactivateGig
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

module.exports = router;