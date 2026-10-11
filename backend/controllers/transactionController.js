/*
Author: MDN Web Docs
Date Accessed: 11 October 2026
Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
Reason: Used to total income, tax and net income from the transactions with Array.reduce.
*/

const Transaction =
    require("../models/transaction");

const round = (value) => Number(value.toFixed(2));

const sumOf = (list, field) =>
    round(list.reduce((total, item) => total + item[field], 0));

const getFreelancerIncome = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({
            freelancer: req.user.id,
            status: { $ne: "Cancelled" }
        }).populate("gig", "title category")
        .sort({ createdAt: -1 });

        // income is only counted once the freelancer completes the booking
        const completed = transactions.filter((t) => t.status === "Completed");
        const pending = transactions.filter((t) => t.status === "Pending");

        res.status(200).json({
            transactions,
            summary: {
                totalIncome: sumOf(completed, "amount"),
                estimatedTax: sumOf(completed, "taxEstimated"),
                netIncome: sumOf(completed, "freelancerIncome"),
                pendingIncome: sumOf(pending, "amount"),
                completedCount: completed.length,
                pendingCount: pending.length
            }
        });
    } catch (err) {
        next(err);
    }
};


module.exports = {
    getFreelancerIncome
}