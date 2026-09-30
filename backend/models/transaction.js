const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
      booking: {type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true, unique: true },
      gig: {type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true },
      client: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      freelancer: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
      amount: { type: Number, required: true, min: 0},
      taxEstimated: { type: Number, required: true, min: 0},
      freelancerIncome: { type: Number, required: true, min: 0},
      status: { type: String, enum: ["Pending", "Completed", "Cancelled"],
        default: "Pending"
      }
    },
    {timestamps: true}
);

module.exports = mongoose.model(
    "Transaction",
    transactionSchema
);