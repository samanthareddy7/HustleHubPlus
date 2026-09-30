const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const requireRole =
    require("../middleware/roleMiddleware");

const {
    createGigValidationRules,
    gigIdValidationRules,
    handleGigValidationErrors
} = require("../middleware/validateGig");

const {
    getGigs,
    getGigById,
    getMyGigs,
    createGig,
    updateGig,
    deleteGig
} = require("../controllers/gigController");


//public facing routes
router.get(
    "/",
    getGigs
);


router.get(
    "/:id",
    gigIdValidationRules,
    handleGigValidationErrors,
    getGigById
);


//freelancer routes
router.get(
    "/mine/list",
    authMiddleware,
    requireRole("freelancer"),
    getMyGigs
);


router.post(
    "/",
    authMiddleware,
    requireRole("freelancer"),
    createGigValidationRules,
    handleGigValidationErrors,
    createGig
);


router.put(
    "/:id",
    authMiddleware,
    requireRole("freelancer"),
    gigIdValidationRules,
    createGigValidationRules,
    handleGigValidationErrors,
    updateGig
);


router.delete(
    "/:id",
    authMiddleware,
    requireRole("freelancer"),
    gigIdValidationRules,
    handleGigValidationErrors,
    deleteGig
);


module.exports = router;