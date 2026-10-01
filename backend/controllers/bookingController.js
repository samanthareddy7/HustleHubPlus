const Gig = require("../models/gigs");
const Booking = require("../models/booking");
const Transaction = require("../models/transaction");

const TAX_RATE = 0.20;

const createBooking = async (req, res, next) => {
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

        //freelancer cannot book own gig
        if(gig.freelancer.toString() === req.user.id){
            const error = new Error("You cannot book your own gig");

            error.statusCode = 404;
            throw error;
        }

        const amount = gig.price;

        const taxEstinated = 
        Number(
            (amount * TAX_RATE).toFixed(2)
        );

        const freelancerIncome = Number ((amount-taxEstinated).toFixed(2));

        //creates a booking 
        const booking = await Booking.create({
            gig: gig._id,
            client: req.user.id,
            freelancer: gig.freelancer,
            amount,
            taxEstimated,
            status:"Pending"
        });


        //automatically create a transaction after booking
        const transaction = await Transaction.create({
                booking: booking._id,
                gig: gig._id,
                client: req.user.id,
                freelancer: gig.freelancer,
                amount,
                taxEstimated,
                freelancerIncome,
                status: "Pending"
            }
        );

        res.status(201).json({
            message: "Booking and transaction created successfully",
            booking,
            transaction
        })


    }
    catch(err){
        next(err)
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