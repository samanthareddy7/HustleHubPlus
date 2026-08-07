require('dotenv').config();

const https = require("https")

const httpsOptions = require("./config/httpsConfig");

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Security headers
app.use(helmet());

// Controlled cross-origin access (frontend will run on a different port in Part 2)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Simple health check route so we can confirm the server is alive

// Centralised error handler — must not leak stack traces or internal details
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: 'Something went wrong. Please try again later.'
  });
});

const HTTPS_PORT = process.env.HTTPS_PORT || 4000;
const APP_NAME = process.env.APP_NAME || "HustleHub+"


const server = https.createServer(httpsOptions, app);


app.listen(HTTPS_PORT, () => {
  console.log(`HustleHub+ API running on port ${HTTPS_PORT}`);
});