/*
Author: Mongoose
Date Accessed: 11 October 2026
Link: https://mongoosejs.com/docs/queries.html
Reason: Used to write the Mongoose queries (find, findOne, populate and sort) for the gig CRUD operations.
*/
/*
Author: W3Schools
Date Accessed: 11 October 2026
Link: https://www.w3schools.com/nodejs/nodejs_mongodb_query.asp
Reason: Used to filter gigs by fields such as isActive and freelancer in MongoDB queries.
*/

const Gig = require("../models/gigs");
const Booking = require("../models/booking");

//gets all gigs
const getGigs = async (req, res, next) => {
    try{
        const gigs = await Gig.find({
            isActive : true
        })
        .populate("freelancer","name")
        .sort({createdAt: -1})

        res.status(200).json({gigs});
    }catch(err){
        next(err);
    }
};


//gets gig by id
const getGigById = async(req,res,next) => {
    try{

        const gig = await Gig.findOne({
            _id: req.params.id,
            isActive: true
        }).populate(
            "freelancer",
            "name"
        );

        if(!gig) {
            const error = new Error("Gig not found");

            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            gig
        });
    }catch(err){
        next(err);
    }
};

//gets the signed in/current freelancer's gigs

const getMyGigs = async (req, res, next) => {
    try {

        const gigs = await Gig.find({
            freelancer: req.user.id
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            gigs
        });

    } catch (err) {
        next(err);
    }
};

const createGig = async( req, res, next) => {
    try{
        const { title, description, category, price, isActive} = req.body;

        const gig = await Gig.create({
            title, 
            description,
            category,
            price,
            //taken from the token 
            freelancer: req.user.id
        });

        res.status(201).json({
            message: "Gig created successfully",
            gig
        })
    }catch(err){
        next(err)
    }
};

//update own gig as a freelancer signed in

const updateGig = async (req, res, next) => {
    try {
        const { title, description, category, price, isActive} = req.body;

        const gig = await Gig.findOneAndUpdate(
            {
                _id: req.params.id,
                freelancer: req.user.id
            },
            { title, description, category, price, isActive},

            {new: true,
            runValidators:true}

        );

        if (!gig) {

            const error = new Error(
                "Gig not found or you do not own this gig"
            );
            error.statusCode = 404;
            throw error;
        }


        res.status(200).json({
            message: "Gig updated successfully",
            gig
        });

    } catch (err) {
        next(err);
    }
};

//deletig owned gig
const deleteGig = async (req, res, next) => {
    try {

        // Find the gig first
        const gig = await Gig.findOne({
            _id: req.params.id,
            freelancer: req.user.id
        });

        if (!gig) {
            const error = new Error(
                "Gig not found or you do not own this gig"
            );
            error.statusCode = 404;
            throw error;
        }

        // Prevent deletion if the gig has any bookings
        const bookingExists = await Booking.exists({
            gig: gig._id
        });

        if (bookingExists) {
            const error = new Error(
                "This gig cannot be deleted because it has existing bookings."
            );
            error.statusCode = 409;
            throw error;
        }

        // Safe to delete
        await gig.deleteOne();

        res.status(200).json({
            message: "Gig deleted successfully"
        });

    } catch (err) {
        next(err);
    }
};


module.exports = {
    getGigs,
    getGigById,
    getMyGigs,
    createGig,
    updateGig,
    deleteGig
};