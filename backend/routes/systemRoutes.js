const express = require("express");

const{
    getRoot,
    getAbout,
    getHealth
} = require ("../controller/systemController")

const router = express.Router();

router.get("/", getRoot)
router.get("/about", getAbout)
router.get("/health", getHealth)

module.exports = router