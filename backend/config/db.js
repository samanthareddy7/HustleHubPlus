/*
Author: Finn Kumar
Date Accessed: 30 August 2026
Link: https://medium.com/@finnkumar6/how-to-connect-mongodb-using-mongoose-in-node-js-like-a-pro-a-fresh-and-modern-approach-6470c69aec16
Reason: Used to implement the asynchronous MongoDB database connection using Mongoose and an environment variable containing the MongoDB connection URI.
*/
const mongoose = require("mongoose");

//asynchronous database connection to connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;