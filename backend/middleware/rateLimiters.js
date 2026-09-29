

//express -rate-limit = take note/record of the number of requests being sent 
const {ratelimit} = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,

    //adds the standard header
    //header = can tell the client info like the current request limit if requested
    standardHeaders: "draft-8",

    //disable the older x-ratelimit headers 
    legacyHeaders:false,

    //response 
    //define the response sent when the client exceeds the limit 
    handler:(
        req,res
    ) =>{
        return res.status(429).json({
            success:false,
            error:"Too many requests"
        })
    }
})

const authLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",

    legacyHeaders:false,
    skipSuccessfulRequests:false,

    //response 
    //define the response sent when the client exceeds the limit 
    handler:(
        req,res
    ) =>{
        return res.status(429).json({
            success:false,
            error:"Too many auth requests. try again later"
        })
    }
});

module.exports ={
    apiLimiter,
    authLimiter
}
