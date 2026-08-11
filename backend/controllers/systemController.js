const { application } = require('express');


const getRoot = (req, res) => {
    const appName = process.env.APP_NAME || "HustleHub+ API";

    return res.status(200).json({
        application : appName,
        message: "Weclome to HustleHub+"
    })
};

const getAbout = (req,res) => {
    const appName = process.env.APP_NAME || "HustleHub+ API";

    return res.status(200).json({
        application : appName,
        description: "HustleHub+ is a ......"
    });
};
const getHealth = (req, res) => {
    
    const appName = process.env.APP_NAME || "HustleHub+ API";

    res.status(200).json({ 
        application : appName,
        status: "ok", 
        message: "HustleHub+ API is running",
        protocol: "HTTPS",
        timestamp: new Date().toISOString
    });
};

module.exports ={
    getRoot,
    getAbout,
    getHealth
}


