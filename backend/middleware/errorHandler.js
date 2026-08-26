/*
Author: GeeksforGeeks
Date Accessed: 26 August 2026
Link: https://www.geeksforgeeks.org/node-js/explain-error-handling-in-express-js-using-an-example/
Reason: Used for separate error handling class
*/

//handles unexpected errors passed through Express
//skips normal middleware and then looks for a function with four aprameters including err
//sends a response

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || "An unexpected error occurred";

    
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource identifier";
    }

    
    if (err.code === 11000) {
        statusCode = 409;
        message = "A record with this value already exists";
    }


    if (statusCode === 500) {
        message = "An unexpected error occurred";
    }

    console.error(err);

    return res.status(statusCode).json({
        error: message
    });
};

module.exports = errorHandler;