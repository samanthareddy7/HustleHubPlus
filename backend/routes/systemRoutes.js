/*
Author: Express.js
Date Accessed: 26 August 2026
Link: https://expressjs.com/en/guide/routing/ 
Reason: Used official documentation to add routing for server adn api endpoints
*/

const express = require("express");

//imports controller functions which have response logic
const{
    getRoot,
    getAbout,
    getHealth
} = require ("../controllers/systemController")

//creates an express router to handle system endpoints
const router = express.Router();

//connects each router to correct function
router.get("/", getRoot)
router.get("/about", getAbout)
router.get("/health", getHealth)

module.exports = router