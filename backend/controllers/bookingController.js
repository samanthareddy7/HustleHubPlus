const mongoose = require("mongoose");
const Gig = require("../models/gigs");
const Booking = require("../models/booking");
const Transaction = require("../models/transaction");

const TAX_RATE = 0.20;

const createBooking = async (req, res, next) => {
    // session lets booking + transaction succeed or fail together
    const session = await mongoose.startSession();

    try{
        const  {gigId} = req.body;

        const gig= await Gig.findOne({
            _id: gigId,
            isActive: true
        });

        if(!gig) {
            const error = new Error("Gig not found or no longer available");
            error.statusCode = 404;
            throw error;
        }

        if(gig.freelancer.toString() === req.user.id){
            const error = new Error("You cannot book your own gig");
            error.statusCode = 403;
            throw error;
        }

        const amount = gig.price;
        const taxEstimated = Number((amount * TAX_RATE).toFixed(2));
        const freelancerIncome = Number((amount - taxEstimated).toFixed(2));

        let booking;
        let transaction;

        // if either create fails, both are rolled back
        await session.withTransaction(async () => {
            const [createdBooking] = await Booking.create([{
                gig: gig._id,
                client: req.user.id,
                freelancer: gig.freelancer,
                amount,
                taxEstimated,
                status:"Pending"
            }], { session });

            const [createdTransaction] = await Transaction.create([{
                booking: createdBooking._id,
                gig: gig._id,
                client: req.user.id,
                freelancer: gig.freelancer,
                amount,
                taxEstimated,
                freelancerIncome,
                status: "Pending"
            }], { session });

            booking = createdBooking;
            transaction = createdTransaction;
        });

        res.status(201).json({
            message: "Booking and transaction created successfully",
            booking,
            transaction
        });
    }
    catch(err){
        next(err);
    }
    finally{
        await session.endSession();
    }
};

//gets clients booking
const getMyBookings = async(req, res, next) => {
    try{
        const bookings= await Booking.find({
            client: req.user.id
        }).populate("gig","title description price category")
        .populate("freelancer", "name email")
        .sort({createdAt: -1});

        res.status(200).json({
            bookings
        });

    }catch(err) 
    {
        next(err);
    }
}

const getFreelancerBookings = async(req, res, next) => {
    try{
        const bookings= await Booking.find({
            freelancer: req.user.id
        }).populate("gig","title description price category")
        .populate("client", "name email")
        .sort({createdAt: -1});

        res.status(200).json({
            bookings
        });

    }catch(err) 
    {
        next(err);
    }
}

const completeBooking = async(req, res, next) => {
    try{
        const booking= await Booking.findOneAndUpdate({
            _id: req.params.id,

            freelancer: req.user.id,
            status: "Pending"
        },
        {
            status: "Completed"
        },
        {
            new: true
        }
    
    );

     if (!booking) {

            const error = new Error(
                "Booking not found or you are not authorised to complete it"
            );

            error.statusCode = 404;

            throw error;
        }


        await Transaction.findOneAndUpdate(
            {
                booking: booking._id
            },
            {
                status: "Completed"
            }
        );


        res.status(200).json({

            message:
                "Booking completed successfully",

            booking
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getFreelancerBookings,
    completeBooking
};