/*
Code Attribution
https://expressjs.com/en/resources/middleware/cors/
https://helmet.js.org/#get-started
https://www.npmjs.com/package/dotenv
https://medium.com/@finnkumar6/how-to-connect-mongodb-using-mongoose-in-node-js-like-a-pro-a-fresh-and-modern-approach-6470c69aec16
https://nodejs.org/api/fs.html
https://stackoverflow.com/questions/31309759/what-is-secret-key-for-jwt-based-authentication-and-how-to-generate-it/
https://expressjs.com/en/5x/guide/writing-middleware/
https://express-rate-limit.mintlify.app/reference/configuration
https://dev.to/rabindratamang/how-to-implement-role-based-access-control-rbac-in-nodejs-applications-1ed2
https://express-validator.github.io/docs/api/validation-chain/
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes
https://www.npmjs.com/package/validator
https://www.npmjs.com/package/express-validator
https://www.geeksforgeeks.org/web-tech/json-web-token-jwt/
https://mongoosejs.com/docs/guide.html
https://www.mongodb.com/docs/manual/core/index-unique/
https://mongoosejs.com/docs/validation.html
https://mongoosejs.com/docs/populate.html
https://www.npmjs.com/package/bcrypt
https://nodejs.org/api/modules.html
https://expressjs.com/en/5x/api/router
https://expressjs.com/en/guide/routing/
https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/routes
https://www.tutorialspoint.com/expressjs/expressjs_routing.htm
https://expressjs.com/en/guide/routing/ 
https://masteringjs.io/tutorials/express/router
https://mongoosejs.com/docs/api/aggregate.html
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
https://www.npmjs.com/package/bcrypt
https://expressjs.com/en/guide/error-handling.html
https://medium.com/@s35919223/middleware-in-express-js-the-complete-deep-dive-c36c632d7824
https://mongoosejs.com/docs/transactions.html
https://www.mongodb.com/docs/manual/core/transactions/
https://mongoosejs.com/docs/queries.html
https://www.w3schools.com/nodejs/nodejs_mongodb_query.asp
https://medium.com/@rohailahmad2226/a-beginners-guide-to-express-js-handling-requests-responses-and-apis-in-node-js-86100a229faf
https://www.geeksforgeeks.org/node-js/why-express-app-and-server-files-kept-separately/
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
*/


/*
Author: Helmet.js
Date Accessed: 26 August 2026
Link: https://helmet.js.org/#get-started
Reason: Configuring helmet for security
*/

/*
Author: Express.js
Date Accessed: 26 August 2026
Link: https://expressjs.com/en/resources/middleware/cors/
Reason: Used for configuring CORS for response headers
*/
const express = require("express");

const helmet = require("helmet");
const cors = require("cors");


//add routes 
const systemRoutes = require("./routes/systemRoutes");
const authRoutes = require("./routes/authRoutes");
const gigRoutes = require("./routes/gigRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const adminRoutes = require("./routes/adminRoutes");

//import middleware/ error handling
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiters");
const sanitizeInput = require("./middleware/sanitizeInput");

const app = express()


//register helmet middleware
//helmet converts directives into corresponding CSP header directives
app.use(helmet({
    contentSecurityPolicy: {
        directives:{
            defaultSrc:["'self'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
            fontSrc:["'self'"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
            baseUri: ["'none'"],
            formAction: ["'self'"],
        }
    }
}));

const clientOrigin = process.env.CLIENT_ORIGIN ||
"https://localhost:5173";

const corsOptions = {
    origin : clientOrigin,
    methods: [
        "GET", 
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],

    allowedHeaders:[
        "Content-Type",
        "Authorization"
    ],

    exposedHeaders:[
        "Content-Length"
    ],

    //doesn't send cookies
    credentials : false,

    optionsSuccessStatus: 204
}

app.use(cors(corsOptions));

app.use(express.json({ limit: "10kb" }));
app.use(sanitizeInput);

app.use(apiLimiter);

app.use("/", systemRoutes);

app.use("/auth", authRoutes);

app.use("/gigs", gigRoutes);

app.use("/bookings", bookingRoutes);

app.use("/transactions", transactionRoutes);
app.use("/admin", adminRoutes);

app.use(notFound);

app.use(errorHandler);

module.exports = app;