require('dotenv').config();
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
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'HustleHub+ API is running' });
});

// Centralised error handler — must not leak stack traces or internal details
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: 'Something went wrong. Please try again later.'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`HustleHub+ API running on port ${PORT}`);
});