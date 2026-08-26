/*
Author: Rohail Ahmad
Date Accessed: 26 August 2026
Link: https://medium.com/@rohailahmad2226/a-beginners-guide-to-express-js-handling-requests-responses-and-apis-in-node-js-86100a229faf
Reason: Used to implement a basic express.js server
*/


/*
Author: GeeksforGeeks
Date Accessed: 26 August 2026
Link: https://www.geeksforgeeks.org/node-js/why-express-app-and-server-files-kept-separately/
Reason: Used to implement a basic express.js server and separate concerns between server and app
*/


const { application } = require('express');

//handles response logic for system routes like health endpoints and about endpoints.
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

//exports controller functions imported by routes
module.exports ={
    getRoot,
    getAbout,
    getHealth
}


