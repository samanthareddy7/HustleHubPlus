const Transaction =
    require("../models/transaction");

const getFreelancerIncome = async( req, res, next) => {

    try{
    const transaction = await Transaction.find({
        freelancer: req.user.id,
        status: {$ne:"Cancelled"}
    }).populate("gig", "title category")
    .sort({createdAt: -1});

    const totalIncome = transaction.reduce((total, transaction) => total + transaction.amount, 0);

    const totalTax = transactions.reduce((total, transaction) => total + transaction.taxEstimated, 0);

    const netIncome = transactions.reduce((total, transaction) => total + transaction.freelancerIncome, 0);

    res.status(200).json({transactions, summary:{
        totalIncome:Number(totalIncome.toFixed(2)),
        estimatedTax: Number(totalTax.toFixed(2)),
        netIncome:Number(netIncome.toFixed(2))    
    }});
    }catch(err){
        next(err)
    }
}


module.exports = {
    getFreelancerIncome
}