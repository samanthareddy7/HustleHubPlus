/*
Author: validator.js
Date Accessed: 11 October 2026
Link: https://www.npmjs.com/package/validator
Reason: Used the isMongoId validator to check that gig and booking IDs are valid MongoDB ObjectIds.
*/

const { body,param, validationResult } = require("express-validator");

const createBookingValidationRules = [
    body("gigId")
        .isMongoId()
        .withMessage("A valid gig ID is required")
];


const bookingIdValidationRules = [
    param("id")
        .isMongoId()
        .withMessage("Invalid booking ID")
];

// stops the request with a 400 before it reaches the controller
const handleBookingValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error(errors.array()[0].msg)
    
    error.statusCode =400;
    return next(error);
    }
    next();
}


module.exports = {createBookingValidationRules, bookingIdValidationRules, handleBookingValidationErrors};