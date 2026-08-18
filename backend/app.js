const express = require("express");

const helmet = require("helmet");
const cors = require("cors");


//add rooutes 
const systemRoutes = require("./routes/systemRoutes");
const authRoutes = require("./routes/authRoutes");

//import middleware/ error handling
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

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

app.use(express.json());

app.use("/", systemRoutes);

app.use("/auth", authRoutes);

app.use(notFound);

app.use(errorHandler);

module.exports = app;