const Gig = require("../models/gigs");


//gets all gigs
const getGigs = async (req, res, next) => {
    try{
        const gigs = await Gig.find({
            isActive : true
        })
        .populate("freelancer","name email")
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
            "name email"
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
        const gig = await Gig.findOneAndDelete({
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