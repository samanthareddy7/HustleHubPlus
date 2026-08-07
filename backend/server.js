//load .env variables
const dotenv = require("dotenv")
dotenv.config();

//imports the builtin Node.js HTTPS module
const https = require("https")

//imports the configured Express application from app.js
const app = require("./app")

const httpsOptions = require("./config/httpsConfig");


//startup values from environment
const HTTPS_PORT = process.env.HTTPS_PORT || 4000;
const APP_NAME = process.env.APP_NAME || "HustleHub+";

const server = https.createServer(httpsOptions, app);

server.listen(HTTPS_PORT, () => {
  console.log(`${APP_NAME} is running securely on https://localhost:${HTTPS_PORT}`
  );
});

server.on("error", error => {
  console.error("The HustleHub server could not start");
  console.error(error.message);
});