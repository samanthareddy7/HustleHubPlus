/*
Author: Mongoose
Date Accessed: 11 October 2026
Link: https://mongoosejs.com/docs/populate.html
Reason: Used to reference the Gig and User models with ObjectId refs so bookings can be populated.
*/

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
  taxEstimated: { type: Number, required: true } // Calculated during booking creation
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);