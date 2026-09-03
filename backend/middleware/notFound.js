/*
Author: Express.js
Date Accessed: 26 August 2026
Link: https://expressjs.com/en/5x/guide/writing-middleware/
Reason: Used for implementing middleware for error handling
*/

//handles not found errors for incorrect/random routes so app doesn't crash

const notFound = (req, res) => {
    return res.status(404).json ({
        error: "Route not found"
    });
};

module.exports = notFound