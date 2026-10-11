/*
Author: express rate limit
Date Accessed: 11 October 2026
Link: https://express-rate-limit.mintlify.app/reference/configuration
Reason: Used to create separate rate limiters for general, authentication and booking requests with a custom 429 handler.
*/

const { rateLimit } = require("express-rate-limit");

const isTestEnv = process.env.NODE_ENV === "test";

// builds a 429 response that tells the client how long to wait
const buildHandler = (message) => (req, res) => {
  const retryAfter = Number(res.getHeader("Retry-After")) || undefined;

  return res.status(429).json({
    success: false,
    error: message,
    ...(retryAfter && { retryAfterSeconds: retryAfter })
  });
};

// general limiter applied to every request
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: () => isTestEnv,
  handler: buildHandler("Too many requests. Please slow down.")
});

// strict limiter for register and login (brute force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skip: () => isTestEnv,
  handler: buildHandler("Too many auth requests. Try again later.")
});

// limiter for creating bookings (stops booking spam / abuse)
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: () => isTestEnv,
  handler: buildHandler("Too many booking requests. Try again later.")
});

module.exports = {
  apiLimiter,
  authLimiter,
  bookingLimiter
};