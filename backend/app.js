

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







/*
Reference list
Abod, F. (2023). Building an express app with an HTTPS server. [online] DEV Community. Available at: https://dev.to/fredabod/building-an-express-app-with-an-https-server-2mbj [Accessed 24 Aug. 2026].
Ahmad, R. (2024). A beginner’s guide to express.Js: Handling requests, responses, and APIs in node.Js. [online] Medium. Available at: https://medium.com/@rohailahmad2226/a-beginners-guide-to-express-js-handling-requests-responses-and-apis-in-node-js-86100a229faf [Accessed 12 Oct. 2026].
Anthony, V., Ogawa, F.H., Perkkio, A. and Sanchez, J. (2026). Vitest. [online] Vitest.dev. Available at: https://vitest.dev/ [Accessed 12 Oct. 2026].
Auth0 (2026). Token best practices. [online] Auth0 Docs. Available at: https://auth0.com/docs/secure/tokens/token-best-practices [Accessed 24 Aug. 2026].
Chaudhary, A. (2025). Security best practices in MERN stack (2025 guide). [online] CsharpCorner. Available at: https://www.c-sharpcorner.com/article/security-best-practices-in-mern-stack-2025-guide/ [Accessed 24 Aug. 2026].
Cloudflare (2025). What is transport layer security? [online] Cloudflare. Available at: https://www.cloudflare.com/learning/ssl/transport-layer-security-tls/ [Accessed 26 Aug. 2026].
Devi, S. (2025). MERN stack architecture. [online] Medium. Available at: https://medium.com/readers-club/mern-stack-architecture-6b7b5be94f78 [Accessed 24 Aug. 2026].
Dias, T. (2024). Understanding bcrypt: Secure password hashing - Tiago Dias - medium. [online] Medium. Available at: https://medium.com/@tiagofdias/understanding-bcrypt-secure-password-hashing-ce19efb59869 [Accessed 26 Aug. 2026].
Elahi, I. (2025). Mongoose ORM for MERN stack:. [online] Medium. Available at: https://medium.com/@shonugee0004/mongoose-orm-for-mern-stack-48cd810d843b [Accessed 24 Aug. 2026].
Express Rate Limit. (2026). Express-rate-limit. [online] Available at: https://express-rate-limit.mintlify.app/reference/configuration [Accessed 12 Oct. 2026].
Express-Validator (2024). ValidationChain | express-validator. [online] Github.io. Available at: https://express-validator.github.io/docs/api/validation-chain/ [Accessed 12 Oct. 2026].
Express.js (2026a). Basic routing · express.Js 5.x. [online] Express.js. Available at: https://expressjs.com/en/5x/starter/basic-routing/ [Accessed 24 Aug. 2026].
Express.js (2026b). Cors middleware · express.Js. [online] Express.js. Available at: https://expressjs.com/en/resources/middleware/cors/ [Accessed 12 Oct. 2026].
Express.js (2026c). Express error handling. [online] expressjs.com. Available at: https://expressjs.com/en/guide/error-handling.html [Accessed 12 Oct. 2026].
Express.js (2026d). Production best practices: Security · express.Js. [online] Express.js. Available at: https://expressjs.com/en/advanced/best-practice-security/#use-cookies-securely [Accessed 26 Aug. 2026].
Express.js (2026e). Routing · express.Js. [online] Express.js. Available at: https://expressjs.com/en/guide/routing/ [Accessed 12 Oct. 2026].
Express.js (2026f). Writing middleware for use in express apps · express.Js. [online] Express.js. Available at: https://expressjs.com/en/5x/guide/writing-middleware/ [Accessed 26 Aug. 2026].
Express.js (2026g). Writing middleware for use in express apps · express.Js. [online] Express.js. Available at: https://expressjs.com/en/5x/guide/writing-middleware/ [Accessed 12 Oct. 2026].
Gaikwad, S. (2025). Middleware in express.Js — The complete deep-dive. [online] Medium. Available at: https://medium.com/@s35919223/middleware-in-express-js-the-complete-deep-dive-c36c632d7824 [Accessed 12 Oct. 2026].
GeeksforGeeks (2019). JSON web token (JWT). [online] GeeksforGeeks. Available at: https://www.geeksforgeeks.org/web-tech/json-web-token-jwt/ [Accessed 12 Oct. 2026].
GeeksforGeeks (2020). Understanding app.js and server.Js in express.Js. [online] GeeksforGeeks. Available at: https://www.geeksforgeeks.org/node-js/why-express-app-and-server-files-kept-separately/ [Accessed 12 Oct. 2026].
GeeksforGeeks (2021). JWT authentication in node.Js. [online] GeeksforGeeks. Available at: https://www.geeksforgeeks.org/node-js/jwt-authentication-with-node-js/ [Accessed 24 Aug. 2026].
GeeksforGeeks (2024). SessionBased authentication vs. JSON web tokens (JWTs) in system design. [online] GeeksforGeeks. Available at: https://www.geeksforgeeks.org/system-design/session-based-authentication-vs-json-web-tokens-jwts-in-system-design/ [Accessed 26 Aug. 2026].
Helmet.js (2026). Helmet.Js. [online] Js.org. Available at: https://helmet.js.org/#get-started [Accessed 26 Aug. 2026].
Igboagu, I. (2023). How to fetch API data in react. [online] freeCodeCamp.org. Available at: https://www.freecodecamp.org/news/how-to-fetch-api-data-in-react/ [Accessed 12 Oct. 2026].
Jangid, R. (2024). MERN stack security best practices : How to develop a safe and secure application using MERN stack. [online] Medium. Available at: https://medium.com/@jangid.rohit70/mern-stack-security-best-practices-how-to-develop-a-safe-and-secure-application-using-mern-stack-a2b81bbd4bee [Accessed 24 Aug. 2026].
Kantor, I. (2026). Fetch. [online] javascript.info. Available at: https://javascript.info/fetch [Accessed 12 Oct. 2026].
Karpov, V. (2019). Introduction to express’ router. [online] Mastering JS. Available at: https://masteringjs.io/tutorials/express/router [Accessed 12 Oct. 2026].
Kumar, A. (2024). How to connect MongoDB using mongoose in node.Js like a pro: A fresh and modern approach. [online] Medium. Available at: https://medium.com/@finnkumar6/how-to-connect-mongodb-using-mongoose-in-node-js-like-a-pro-a-fresh-and-modern-approach-6470c69aec16 [Accessed 12 Oct. 2026].
Microsoft (2022). Tutorial on React for beginners. [online] learn.microsoft.com. Available at: https://learn.microsoft.com/en-us/windows/dev-environment/javascript/react-beginners-tutorial [Accessed 12 Oct. 2026].
MongoDB (2026a). Security checklist — MongoDB manual. [online] www.mongodb.com. Available at: https://www.mongodb.com/docs/manual/administration/security-checklist/ [Accessed 24 Aug. 2026].
MongoDB (2026b). Transactions — MongoDB manual. [online] www.mongodb.com. Available at: https://www.mongodb.com/docs/manual/core/transactions/ [Accessed 12 Oct. 2026].
MongoDB (2026c). Unique indexes — MongoDB manual. [online] www.mongodb.com. Available at: https://www.mongodb.com/docs/manual/core/index-unique/ [Accessed 12 Oct. 2026].
Mongoose (2018). Transactions - mongoose V9.11.1. [online] Mongoosejs.com. Available at: https://mongoosejs.com/docs/transactions.html [Accessed 12 Oct. 2026].
Mongoose (2021). Aggregate - mongoose V9.11.1. [online] Mongoosejs.com. Available at: https://mongoosejs.com/docs/api/aggregate.html [Accessed 12 Oct. 2026].
Mongoose (2025). Mongoose V8.13.0: Query population. [online] Mongoosejs.com. Available at: https://mongoosejs.com/docs/populate.html [Accessed 12 Oct. 2026].
Mongoose (2026a). Mongoose v5.9.9: Schemas. [online] mongoosejs.com. Available at: https://mongoosejs.com/docs/guide.html [Accessed 12 Oct. 2026].
Mongoose (2026b). Mongoose V8.0.3: Queries. [online] mongoosejs.com. Available at: https://mongoosejs.com/docs/queries.html [Accessed 12 Oct. 2026].
Mongoose (2026c). Mongoose V8.0.3: Validation. [online] mongoosejs.com. Available at: https://mongoosejs.com/docs/validation.html [Accessed 12 Oct. 2026].
Motte, S. (2026). Dotenv. [online] npm. Available at: https://www.npmjs.com/package/dotenv [Accessed 12 Oct. 2026].
Mozilla (2019). Window.sessionStorage. [online] MDN Web Docs. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage [Accessed 12 Oct. 2026].
Mozilla (2026a). Array.Prototype.Reduce(). [online] MDN Web Docs. Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce [Accessed 12 Oct. 2026].
Mozilla (2026b). Character classes - JavaScript | MDN. [online] developer.mozilla.org. Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes [Accessed 1 Sept. 2026].
Mozilla (2026c). Event.preventDefault() - web APIs | MDN. [online] developer.mozilla.org. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault [Accessed 12 Oct. 2026].
Mozilla (2026d). Promise.All() - JavaScript | MDN. [online] developer.mozilla.org. Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all [Accessed 12 Oct. 2026].
Mozilla (2026e). Window.Confirm() - web APIs | MDN. [online] developer.mozilla.org. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm [Accessed 12 Oct. 2026].
Node.js (2026a). File system | node.Js V18.1.0 documentation. [online] nodejs.org. Available at: https://nodejs.org/api/fs.html [Accessed 12 Oct. 2026].
Node.js (2026b). Modules: CommonJS modules | node.Js V19.9.0 documentation. [online] nodejs.org. Available at: https://nodejs.org/api/modules.html [Accessed 12 Oct. 2026].
NPM (2023). Bcrypt. [online] npm. Available at: https://www.npmjs.com/package/bcrypt [Accessed 12 Oct. 2026].
NPM (2026). Validator. [online] npm. Available at: https://www.npmjs.com/package/validator [Accessed 12 Oct. 2026].
Otto, M. (2024). Progress. [online] Getbootstrap.com. Available at: https://getbootstrap.com/docs/5.3/components/progress/ [Accessed 12 Oct. 2026].
Otto, M. (2025). Spinners. [online] Getbootstrap.com. Available at: https://getbootstrap.com/docs/5.3/components/spinners/ [Accessed 12 Oct. 2026].
Otto, M. and Thornton, J. (2026a). Cards. [online] getbootstrap.com. Available at: https://getbootstrap.com/docs/5.3/components/card/ [Accessed 12 Oct. 2026].
Otto, M. and Thornton, J. (2026b). Navbar. [online] getbootstrap.com. Available at: https://getbootstrap.com/docs/5.3/components/navbar/ [Accessed 12 Oct. 2026].
Otto, M., Thronton, J. and Bootstrap (2026). Modal. [online] getbootstrap.com. Available at: https://getbootstrap.com/docs/5.3/components/modal/ [Accessed 12 Oct. 2026].
Patel, S. (2026). NoSQL Injection for beginners. [online] Medium.com. Available at: https://medium.com/@suhani.patel.1701/nosql-injection-for-beginners-c5dd434ccfcd [Accessed 26 Aug. 2026].
React (2025a). React. [online] React.dev. Available at: https://react.dev/reference/react-dom/components/select [Accessed 12 Oct. 2026].
React (2025b). Routing | react router. [online] Reactrouter.com. Available at: https://reactrouter.com/start/declarative/routing [Accessed 12 Oct. 2026].
React (2026a). Conditional rendering – REACT. [online] react.dev. Available at: https://react.dev/learn/conditional-rendering [Accessed 12 Oct. 2026].
React (2026b). createRoot – REACT. [online] reactjs. Available at: https://react.dev/reference/react-dom/client/createRoot [Accessed 12 Oct. 2026].
React (2026c). Reacting to input with state – REACT. [online] react.dev. Available at: https://react.dev/learn/reacting-to-input-with-state [Accessed 12 Oct. 2026].
React (2026d). Rendering lists – REACT. [online] react.dev. Available at: https://react.dev/learn/rendering-lists [Accessed 12 Oct. 2026].
React (2026e). Updating objects in state – react. [online] react.dev. Available at: https://react.dev/learn/updating-objects-in-state [Accessed 12 Oct. 2026].
React (2026f). useEffect – REACT. [online] react.dev. Available at: https://react.dev/reference/react/useEffect [Accessed 12 Oct. 2026].
React Router (2025). useNavigate | react router. [online] Reactrouter.com. Available at: https://reactrouter.com/api/hooks/useNavigate [Accessed 12 Oct. 2026].
React Router (2026). useParams | react router. [online] Reactrouter.com. Available at: https://reactrouter.com/api/hooks/useParams [Accessed 12 Oct. 2026].
Shaik, R. (2025). Middleware, routes, and controllers in MERN Stack. [online] DEV Community. Available at: https://dev.to/shaikr786/middleware-routes-and-controllers-in-mern-stack-how-they-work-together-3766 [Accessed 24 Aug. 2026].
Sudharshan, J. (2025). JWT authentication in node.Js: Complete beginner’s guide (2025). [online] Medium. Available at: https://medium.com/@jithuSudharshan/jwt-authentication-in-node-js-complete-beginners-guide-2025-282e8fc53bec [Accessed 26 Aug. 2026].
Tamang, R. (2025). How to implement role-based access control (RBAC) in node.Js applications. [online] DEV Community. Available at: https://dev.to/rabindratamang/how-to-implement-role-based-access-control-rbac-in-nodejs-applications-1ed2 [Accessed 12 Oct. 2026].
Tutorials Point (2024). Express tutorial part 4: Routes and controllers - learn web development | MDN. [online] MDN Web Docs. Available at: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/routes [Accessed 12 Oct. 2026].
Tutorials Point (2026). ExpressJS - routing. [online] Tutorialspoint.com. Available at: https://www.tutorialspoint.com/expressjs/expressjs_routing.htm [Accessed 12 Oct. 2026].
Veerabrahmam, S.N. (2024). Bulletproof your web apps: How input validation and output encoding defend against XSS attacks. [online] Medium. Available at: https://medium.com/@nandansv1819/bulletproof-your-web-apps-how-input-validation-and-output-encoding-defend-against-xss-attacks-aa638820306a [Accessed 24 Aug. 2026].
Vite (2026). Plugin API. [online] vitejs. Available at: https://vite.dev/guide/api-plugin [Accessed 12 Oct. 2026].
W3 Schools (2026a). Node.Js MongoDB query. [online] www.w3schools.com. Available at: https://www.w3schools.com/nodejs/nodejs_mongodb_query.asp [Accessed 12 Oct. 2026].
W3 Schools (2026b). React forms. [online] www.w3schools.com. Available at: https://www.w3schools.com/react/react_forms.asp [Accessed 12 Oct. 2026].
W3 Schools (2026c). W3Schools.Com. [online] W3schools.com. Available at: https://www.w3schools.com/jsref/jsref_tolocaledatestring.asp [Accessed 12 Oct. 2026].
Wieruch, R. (2026). REACT ROUTER 6: Private routes (alias protected routes). [online] www.robinwieruch.de. Available at: https://www.robinwieruch.de/react-router-private-routes/ [Accessed 12 Oct. 2026].
Yousof, M. (2024). Implementing role-based access control in react 18 with react router V6: A step-by-step guide. [online] DEV Community. Available at: https://dev.to/m_yousaf/implementing-role-based-access-control-in-react-18-with-react-router-v6-a-step-by-step-guide-1p8b [Accessed 12 Oct. 2026].
*/