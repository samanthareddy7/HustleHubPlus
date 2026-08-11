//reader orivate key and certificates for the https server
const fs = require("fs")
//path module create reliable file paths 
const path = require("path")

/*
Creates the full path to the backend folder.

__dirname currently refers to backend/config.

Moving one level upward produces the backend folder.
*/

const backendDirectory = path.resolve(__dirname, "..")


/*
Reads the relative certificate paths from the environment
variables.

Fallback values are supplied when an environment variable is
not available.
*/

const sslKeyPath = process.env.SSL_KEY_PATH ||
"certificates/privatekey.pem";

const sslCertPath = process.env.SSL_CERT_PATH ||
"certificates/certificate.pem"

const resolvedKeyPath = path.resolve(
    backendDirectory,
    sslKeyPath
)

const resolvedCertPath = path.resolve(
    backendDirectory,
    sslCertPath
);


//read the priv key and cert
//both files are required to create https
const httpsOptions ={
    key: fs.readFileSync(resolvedKeyPath),
    cert: fs.readFileSync(resolvedCertPath)
};

module.exports = httpsOptions;