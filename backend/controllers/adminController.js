const { User } = require("../models/user");
const Gig = require("../models/gigs");
const Booking = require("../models/booking");
const Transaction = require("../models/transaction");

// all users (never returns password hashes)
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find()
            .select("-passwordHash -__v")
            .sort({ createdAt: -1 });

        res.status(200).json({ users });
    } catch (err) {
        next(err);
    }
};

// every booking on the platform
const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate("gig", "title price")
            .populate("client", "name email")
            .populate("freelancer", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ bookings });
    } catch (err) {
        next(err);
    }
};

// platform totals for the admin dashboard
const getPlatformStats = async (req, res, next) => {
    try {
        const [users, gigs, bookings, transactions, revenue] = await Promise.all([
            User.countDocuments(),
            Gig.countDocuments(),
            Booking.countDocuments(),
            Transaction.countDocuments(),
            Transaction.aggregate([
                { $match: { status: "Completed" } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])
        ]);

        res.status(200).json({
            stats: {
                users,
                gigs,
                bookings,
                transactions,
                completedValue: revenue[0] ? revenue[0].total : 0
            }
        });
    } catch (err) {
        next(err);
    }
};

// moderation: admin can take a gig off the marketplace
const deactivateGig = async (req, res, next) => {
    try {
        const gig = await Gig.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!gig) {
            const error = new Error("Gig not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: "Gig deactivated successfully",
            gig
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllUsers,
    getAllBookings,
    getPlatformStats,
    deactivateGig
};