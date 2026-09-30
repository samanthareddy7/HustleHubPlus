const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema(
    {
        title:{ type: String, required: true, trim: true, maxlength: 200},
        description:{ type: String, required: true, trim: true, maxlength: 2000 },
        price: { type: Number, required: true, trim: true, min: 0},
        category: {type:String, required: true,trime: true, maxlength: 50 },
        freelancer: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        isActive: {type:Boolean, default: true}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Gig",gigSchema);