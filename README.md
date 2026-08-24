# HustleHub+

HustleHub+ is a secure, full-stack MERN freelance marketplace platform. 
It enables freelancers to market services (gigs), clients to browse and book offerings and provides built-in financial record-keeping with 
real-time income tracking and tax value estimation. 

Security is designed into the core architecture from the start of development.
It incorporates HTTPS transport security, role-based access controls,
password hashing and strict input validation/sanitation.

# Intended Users & Role-Based Access Control (RBAC)

HustleHub+ categorises users into three distinct roles:

| Role | Description & System Permissions |
|------|------------------|
| **Client** | Browses available marketplace gigs, books freelancer services, and generates simulated payment transaction records. |
| **Freelancer** | Creates and manages gig listings, views client bookings and tracks income and estimated tax values. |
| **Admin** | System-wide administrator responsible for user management, platform log monitoring of key system events and platform maintenance. |

<img width="690" height="1845" alt="securityarchitrcture" src="https://github.com/user-attachments/assets/37c81846-7374-44b6-aacb-3c62c9fa4157" />

# Detailed Architectural Breakdown

**1. Client Layer (User Device)**

The user-facing side of the system is the client layer, which contains the React.js frontend. This is used for building interactive user interfaces. It uses a component-based architecture to render dynamic content, capture user inputs (credentials, gig creations, and booking requests, for example), and format them into JSON payloads that are sent to the server (Devi, 2025). 

Communication starts from this layer and crosses the external network boundary through HTTPS Requests. Operating strictly outside the system's core backend, the client therefore has no direct access to application memory, internal service/utility modules or the database layer (Abod, 2023).

**2. Backend Layer (Node.js HTTPS Server)**

The Business Logic Layer represents the secure backend running on a Node.js runtime environment. This layer intercepts, validates, processes, and responds to all incoming client traffic. It is divided into four primary internal sub-systems:

**- HTTPS Listener (SSL/TLS):**
  
This is the initial security module for the backend, where the Express.js framework handles the HTTPS requests. The server decrypts inbound transport-layer traffic using local self-signed SSL/TLS certificates (cert.pem and key.pem). This ensures that all incoming user data, authentication headers and transactional details are protected against packet sniffing and Man-in-the-Middle (MitM) attacks (MongoDB, 2026). 

**- Input Validation & Sanitisation:**

Immediately after transport decryption, this middleware inspects raw incoming HTTP request bodies. It executes strict input cleaning and validation. By validating the data at the start, this helps to protect the downstream controllers from processing incorrect/malformed data, Cross-Site Scripting (XSS) payloads, or NoSQL query injection attempts.


Once sanitised  (through white-space trimming, normalising string-casing and validating through password checks, etc.), requests flow into specialised Express.js middleware modules.
The middleware exists for authentication to intercept the protected routes, verify JWT bearer tokens and complete session handling. The gig and transaction middleware is responsible for enforcing role-based permissions and preventing logic violations like price tampering (Shaik, 2025). 


**- API Controllers (Auth, Gig and Transaction Controllers):**
  
The core routing engine sends the verified requests to their corresponding domain controllers.

*Auth Controller:*  Manages user registration, credential validation, user profile retrieval, and sessions

*Gig Controller:* Handles the creation, retrieval, update, and deletion of freelancer gig management

*Transaction Controller:*  Manages client booking workflows, creates simulated payment transaction records, and calculates freelancer income and estimated tax income (Shaik, 2025).

**- Security & Utilities:**

The controllers rely on dedicated background utility helper classes to execute logic. Security utilities provide asynchronous password hashing using bcrypt to guarantee secure credential storage. It also encapsulates the token creation logic, signing JWTs for stateless authentication.
The financial utilities assist the Transaction Controller by executing standardised income tracking algorithms and calculating estimated tax obligations for freelancer financial dashboards.
The system logger intercepts key system actions across all controllers to maintain chronological audit logs for administrative security monitoring (Jangid, 2024).

**3. Data Abstraction Layer — Mongoose ORM** 

Connected to the Express API server is the Mongoose ORM Layer. Mongoose helps to establish a strict object data modelling interface over the raw database connection, defining strongly-typed schemas for system entities (Elahi, 2025). 

**4. Database Boundary — Cloud Database**
At the bottom of the diagram lies the Cloud Database Boundary, hosting the persistent storage infrastructure on MongoDB Atlas.

The Mongoose ORM Layer interacts with MongoDB Atlas through the native Mongoose/Node.js Driver over an encrypted  connection using the MongoDB SRV protocol (mongodb+srv://). The remote cluster maintains a data collection  which provides high availability, TLS-encrypted data at rest and in transit, and complete structural separation from the application web server (Elahi, 2025).





# Authentication Request Flow

After a user registers or logs into the system, the request goes through a multi-stage security pipeline created to prevent unauthorised access, data corruption and user credential leaks. First, an encrypted HTTPS POST request which contains the user details is sent to the api endpoint. The transport layer terminates at the Node.js HTTPS listener, which decrypts the TLS payload using the server's SSL certificate (cert.pem) and private key (key.pem). Once decrypted, the request passes immediately into the validateAuth middleware before any application logic or database operations are executed. This middleware parses the JSON body, trims surrounding whitespace, normalises string inputs (such as forcing email addresses to lowercase), and tests fields against rigid regular expressions. 

If the validation fails, the middleware immediately aborts the request flow and returns an HTTP 400 Bad Request response with explicit validation messages, preventing incorrect or malicious data from reaching the database. If the payload passes validation, execution transfers to authController.js. The controller first checks whether the email already exists in the database using Mongoose . If the user exists, an HTTP 409 Conflict error is returned. If the email is unique, the user's plain-text password is sent to bcrypt to be hashed asynchronously using 12 salt rounds. The resulting hash—never the plain-text password—is assigned to the user document and persisted to MongoDB Atlas. Upon successful document creation, the controller calls generateToken.js to construct a signed JSON Web Token (JWT). Finally, the server dispatches an HTTP 201 Created response containing the JWT and a sanitised user object that explicitly excludes sensitive fields like passwordHash.

# Token Usage & Role-Based Access Control (RBAC) Architecture

HustleHub+ uses JSON Web Tokens (JWT) to implement a stateless, token-based authentication and authorisation system. In a conventional session-based framework, the server must store session IDs in memory or a database (such as Redis) and query that store on every single client request. By using JWTs, HustleHub+ offloads session state management to the token itself, allowing the backend to scale horizontally and eliminate unnecessary database lookups during authorisation checks. A generated JWT consists of three base64url-encoded parts: the Header, the Payload, and the Signature. The Payload contains non-sensitive identity claims, specifically the user’s unique MongoDB identifier (userId) and their assigned system role (role: client, freelancer, or admin). The token is cryptographically signed using the HMAC SHA-256 (HS256) algorithm with a high-entropy secret key stored in environment variables (JWT_SECRET). This signature guarantees data integrity: if a malicious client attempts to modify their role inside the token payload (e.g., changing client to admin), the server's signature verification step will fail, invalidating the token.To access protected routes (such as creating a gig or viewing earnings), the client must attach the JWT to the HTTP request using the standardized Authorization header with the Bearer schema:HTTPAuthorization: Bearer <TOKEN>
An authentication guard middleware intercepts incoming requests, extracts the bearer token, verifies its signature using JWT_SECRET, and checks that the token has not expired. Once verified, the decoded payload claims are attached to the Express request object (req.user), making the user’s identity and role immediately accessible to downstream controllers for sub-millisecond Role-Based Access Control (RBAC) evaluation.

# Input Validation, Sanitization, and Injection Defense Approach

Input validation in HustleHub+ is applied at the outer boundary of the backend architecture using custom Express middleware. The primary objective is to guarantee that untrusted input from external users is rigorously sanitized and checked before it can interact with application logic or the MongoDB persistence layer.The validation pipeline enforces a strategy of strict whitelisting and regular expression matching:

- Name Validation: Ensures the name field is present, stripped of trailing spaces, and restricted to an acceptable character set and length (2 to 50 characters).
- Email Sanitization & Normalization: Validates proper syntax using an email regex (/^[^\s@]+@[^\s@]+\.[^\s@]+$/) and converts all characters to lowercase to prevent duplicate account registration caused by case variations (e.g., User@Domain.com vs. user@domain.com).
- Password Complexity Policy: Enforces strong security requirements via complex lookahead regular expressions (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/). This ensures passwords are at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.
- Role Whitelisting: Enforces enum constraints, restricting assigned roles strictly to client, freelancer, or admin. Any attempt to pass an unrecognized role string is rejected.Beyond format enforcement, this boundary validation acts as a primary defense against NoSQL Injection and Cross-Site Scripting (XSS). By ensuring that input fields contain only valid primitives (strings, numbers) and rejecting raw query objects or script tags, the middleware prevents malicious actors from manipulating MongoDB query selectors or injecting malicious client-side code into stored database fields.

# Security Rationale & Implementation Decisions

***1. Transport Layer Security (HTTPS)***

The API relies exclusively on HTTPS generated by Node's native https module.
In a financial platform handling credentials and income tracking, HTTP transmits plain-text data. 
HTTPS encrypts data in transit via TLS, preventing Man-in-the-Middle (MitM) attacks and packet sniffing on untrusted networks.

***2. Password Hashing (bcrypt)***
Passwords are hashed using bcrypt with salt rounds before storage in MongoDB.
Storing plain-text passwords or using fast algorithms (like MD5 or SHA256) leaves credentials vulnerable to rainbow table attacks if a database breach occurs. 
bcrypt incorporates key stretching and salt generation, rendering brute-force attacks computationally expensive.

***3. Token-Based Authentication (JSON Web Tokens)***
Authentication is stateless through JWTs passed in the HTTP ``` Authorization: Bearer <TOKEN> ``` header.
Stateless tokens avoid session storage overhead on the server and scale effortlessly in a MERN stack. 
Claims inside the payload (id and role) allow for fast Role-based access control evaluation on protected endpoints without requiring a database read on every request.


***4. Input Validation & Data Sanitization***
Request bodies pass through explicit validation middleware (validateAuth.js) prior to being received by the controllers.
Untrusted user input is trimmed, normalised, lowercased (for emails), and checked against rigid regular expressions (for passwords). 
This helps to defend against NoSQL Injection, Cross-Site Scripting (XSS), and invalid enum values at the boundary layer.

# Local Setup Instructions

**1. Prerequisites**

**Node.js:** v18.x or v20+ LTS

**MongoDB Community Server:** Running locally on port 27017

**OpenSSL:** Standard terminal utility

**2. Installation**

Clone the repository and install backend dependencies:
````
git clone https://github.com/hustlehub-plus.git
````

```
cd hustlehub-plus/backend
```
```
npm install
```

**3. Generate Local SSL Certificates**
Run the following command in Git Bash or Terminal inside the backend folder:

```
mkdir -p certs
openssl req -x509 -newkey rsa:2048 -nodes -keyout certs/key.pem -out certs/cert.pem -days 365 -subj "/CN=localhost"
```

**4. Environment Configuration**
Create a .env file inside the backend directory based on .env.example:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hustlehub_plus
JWT_SECRET=hustlehub_super_secret_jwt_key_2026
BCRYPT_ROUNDS=12
```

**5. Running the Application**

Start local MongoDB, then run:

# Development Mode 
```
npm run dev
```

# Production Mode
```
npm start
```
The HTTPS server will start on https://localhost:5000.
