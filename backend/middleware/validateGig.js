const { body, param, validationResult } = require("express-validator");

//validation rules for creeating a gig
const createGigValidationRules = [
//valid title has to be entered
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Title must be between 3 and 100 characters"),

//valid description is required
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 10, max: 2000 })
        .withMessage(
            "Description must be between 10 and 2000 characters"
        ),
//valid category must e added/selected
    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .isLength({ max: 50 })
        .withMessage("Category is too long"),

//correct price should be used 
    body("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number")
];


const gigIdValidationRules = [
    param("id")
        .isMongoId()
        .withMessage("Invalid gig ID")
];

// stops the request with a 400 before it reaches the controller
const handleGigValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error(errors.array()[0].msg)
    
    error.statusCode =400;
    return next(error);
    }
    next();
}



module.exports = {createGigValidationRules,gigIdValidationRules,handleGigValidationErrors};
