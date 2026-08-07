const express = require("express");

//add rooutes 
const systemRoutes = require("./routes/systemRoutes");
const authRoutes = require("./routes/authRoutes");

//import middleware/ error handling
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express()

app.use("/", systemRoutes);

app.use("/auth", authRoutes);

app.use(notFound);

app.use(errorHandler);

module.exports = app;