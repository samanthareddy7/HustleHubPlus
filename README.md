# HustleHub+

<p align="justify">
HustleHub+ is a secure, full-stack freelance marketplace built on the MERN stack (MongoDB, Express.js, React.js, and Node.js) that connects clients with skilled freelancers for browsing and booking specialized service gigs. The platform also integrates automated financial management tools that track client bookings, calculate freelancer gross earnings and estimate tax liabilities. Designed with security from the start, HustleHub+ protects sensitive identity and transactional data using end-to-end HTTPS encryption, bcrypt password hashing, stateless JSON Web Token (JWT) authentication, strict Role-Based Access Control, and  validation middleware to help defend against web vulnerabilities like NoSQL injection and XSS.
</p>

<img width="450" height="1200" alt="securitydiagram2" src="https://github.com/user-attachments/assets/04ccd74f-6aa8-4c1e-80c7-3eece8795e76" />


# 1. Detailed Architectural Breakdown

**1. Client Layer (User Device)**
<p align="justify">
The user-facing side of the system is the client layer, which contains the React.js frontend. This is used for building interactive user interfaces. It uses a component-based architecture to render dynamic content, capture user inputs (credentials, gig creations, and booking requests, for example), and format them into JSON payloads that are sent to the server (Devi, 2025). 
</p>
<p align="justify">
Communication starts from this layer and crosses the external network boundary through HTTPS Requests. Operating strictly outside the system's core backend, the client therefore has no direct access to application memory, internal service/utility modules or the database layer (Abod, 2023).
</p>

**2. Backend Layer (Node.js HTTPS Server)**

The Business Logic Layer represents the secure backend running on a Node.js runtime environment. This layer intercepts, validates, processes, and responds to all incoming client traffic. It is divided into four primary internal sub-systems:

**- HTTPS Listener (SSL/TLS):**

<p align="justify">
This is the initial security module for the backend, where the Express.js framework handles the HTTPS requests. The server decrypts inbound transport-layer traffic using local self-signed SSL/TLS certificates (cert.pem and key.pem). This ensures that all incoming user data, authentication headers and transactional details are protected against packet sniffing and Man-in-the-Middle (MitM) attacks (MongoDB, 2026). 
</p>

**- Input Validation & Sanitisation:**

<p align="justify">
Immediately after transport decryption, this middleware inspects raw incoming HTTP request bodies. It executes strict input cleaning and validation. By validating the data at the start, this helps to protect the downstream controllers from processing incorrect/malformed data, Cross-Site Scripting (XSS) payloads, or NoSQL query injection attempts.
</p>

<p align="justify">
Once sanitised  (through white-space trimming, normalising string-casing and validating through password checks, etc.), requests flow into specialised Express.js middleware modules.
The middleware exists for authentication to intercept the protected routes, verify JWT bearer tokens and complete session handling. The gig and transaction middleware is responsible for enforcing role-based permissions and preventing logic violations like price tampering (Shaik, 2025). 
</p>

**- API Controllers (Auth, Gig and Transaction Controllers):**
  
The core routing engine sends the verified requests to their corresponding domain controllers.

*Auth Controller:*  Manages user registration, credential validation, user profile retrieval, and sessions

*Gig Controller:* Handles the creation, retrieval, update, and deletion of freelancer gig management

*Transaction Controller:*  Manages client booking workflows, creates simulated payment transaction records, and calculates freelancer income and estimated tax income (Shaik, 2025).

**- Security & Utilities:**

<p align="justify">
The controllers rely on dedicated background utility helper classes to execute logic. Security utilities provide asynchronous password hashing using bcrypt to guarantee secure credential storage. It also encapsulates the token creation logic, signing JWTs for stateless authentication.
The financial utilities assist the Transaction Controller by executing standardised income tracking algorithms and calculating estimated tax obligations for freelancer financial dashboards. The system logger intercepts key system actions across all controllers to maintain chronological audit logs for administrative security monitoring (Jangid, 2024).
</p>

**3. Data Abstraction Layer — Mongoose ODM** 

<p align="justify">
Connected to the Express API server is the Mongoose ODM Layer. Mongoose helps to establish a strict object data modelling interface over the raw database connection, defining strongly-typed schemas for system entities (Elahi, 2025). 
</p>

**4. Database Boundary — Cloud Database**
<p align="justify">
At the bottom of the diagram is the Cloud Database, hosting the persistent storage infrastructure on MongoDB Atlas. The Mongoose Layer interacts with MongoDB Atlas through the native Mongoose/Node.js Driver over an encrypted  connection using the MongoDB SRV protocol (mongodb+srv://). The remote cluster maintains a data collection  which provides high availability, TLS-encrypted data at rest and in transit, and complete structural separation from the application web server (Elahi, 2025).
</p>

# 2. Authentication Request Flow

<p align="justify">
After a user registers or logs into the system, the request goes through multiple security checks created to prevent unauthorised access, data corruption and user credential leaks. At the start, when the user sends a request, it's sent as an encrypted HTTPS POST request. This contains the user details sent to the api endpoint. The transport layer ends at the Node.js HTTPS listener, which decrypts the TLS payload (CloudFlare, 2025) using the server's SSL certificate (cert.pem) and private key (key.pem). Once decrypted, the request passes immediately into the validation middleware before any application logic or database operations are completed. This middleware parses the JSON body and validates and sanitises inputs(Shaik, 2025) 
</p>

<p align="justify">
If the validation fails, the middleware immediately stops the request flow and returns a 400 Bad Request response with explicit validation messages. This helps to prevent incorrect or malicious data from reaching the database. If the payload passes validation, it is then transferred to the controllers handles data generation and orchestration. If the user exists in the system already, a 409 Conflict error is returned. If the email is unique, the user's plain-text password is sent to the service helpers to be hashed asynchronously using 12 salt rounds. Only the hashed and salted password is saved to MongoDB. Upon successful user creation, the controller calls a service class to construct a signed JSON Web Token (JWT). Finally, the server sends a 201 Created response containing the JWT and a sanitised user object that explicitly excludes sensitive fields (Sudharshan, 2026). 
</p>

# 3. Token Usage & Role-Based Access Control (RBAC) Architecture

HustleHub+ categorises users into three distinct roles:

| Role | Description & System Permissions |
|------|------------------|
| **Client** | Browses available marketplace gigs, books freelancer services, and generates simulated payment transaction records. |
| **Freelancer** | Creates and manages gig listings, views client bookings and tracks income and estimated tax values. |
| **Admin** | System-wide administrator responsible for user management, platform log monitoring of key system events and platform maintenance. |

<p align="justify">
HustleHub+ uses JSON Web Tokens (JWT) to implement a stateless, token-based authentication and authorisation system for role-based access control. In a conventional session-based framework, the server must store session IDs in memory or a database and query that store on every single client request (GeeksforGeeks, 2024). By using JWTs, HustleHub+ offloads session state management to the token itself.
A generated JWT consists of three parts: a header, payload and signature. The Payload contains non-sensitive identity claims, specifically the user’s userId and their assigned system role (client, freelancer or admin). The token is cryptographically signed using the HMAC SHA-256 (HS256) algorithm with a secret key. This signature guarantees data integrity (Sudharshan, 2025). If a malicious client attempts to modify their role inside the token payload (e.g., changing client to admin), the server's signature verification step will fail, invalidating the token. To access protected routes (such as creating a gig or viewing earnings), the client must attach the JWT to the HTTP request using the standardised Authorisation header with the Bearer schema: HTTP Authorisation: Bearer <TOKEN> . (Auth0, 2026)
</p>

<p align="justify">
An authentication middleware intercepts incoming requests, extracts the bearer token, verifies its signature using the key, and checks that the token has not expired. Once verified, the decoded payload claims are attached to the Express request object, making the user’s identity and role immediately accessible to controllers for  Role-Based Access Control evaluation (Sudharshan, 2025).
</p>

# Input Validation, Sanitisation

<p align="justify">
Input validation in HustleHub+ is applied at the start of the backend architecture using middleware. The main objective of this is to guarantee that untrusted input from external users is rigorously sanitised and checked before it can interact with application logic or the MongoDB layer. The validation pipeline enforces a strategy of strict whitelisting and regular expression matching. Names and emails are validated and trimmed for extra whitespace and normalised with accepted string casing. There is also a strict password complexity policy. This enforces a strict password check using regular expressions. This helps to ensure passwords are at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one numeric digit and one special character.
Any attempt to pass an unrecognised role string is rejected. Beyond format enforcement, this validation acts as a primary defence against NoSQL Injection and Cross-Site Scripting (XSS). By ensuring that input fields contain only valid parameters (strings, numbers) and rejecting raw query objects or script tags, the middleware prevents malicious actors from manipulating MongoDB query selectors or injecting malicious client-side code into stored database fields (Patel, 2026).
</p>

# Security Rationale & Implementation Decisions

  
***1. Transport Layer Security (HTTPS)***
<p align="justify">
The API relies on HTTPS generated by Node's native https module and TLS connections to MongoDB atlas. For this system which deals with gig management and booking financials, managing sensitive data, transaction records and tax estimates protects user credentials and payload data from Man-in-the-Middle attacks. Encrypting traffic in transit protects confidentiality and data integrity across untrusted public networks (Chaudary, 2025).
</p>

***2. Password Hashing (bcrypt)***
<p align="justify">
Storing passwords in plain text or using fast cryptographic hash functions (such as MD5, SHA-1, or SHA-256) leaves user credentials vulnerable to rainbow table lookups and rapid brute-force attacks if a database breach occurs. bcrypt incorporates dynamic, salt generation and key stretching, making offline brute-force attempts computationally expensive and time-prohibitive for attackers (Dias, 2024).
</p>

***3. Token-Based Authentication (JSON Web Tokens)***
<p align="justify">
Authentication is stateless through JWTs passed in the HTTP ``` Authorization: Bearer <TOKEN> ``` header instead of server-side session cookies. 
Stateless tokens avoid session storage overhead on the server. Claims inside the payload (id and role) allow for fast Role-based access control evaluation on protected endpoints without requiring a database read on every request (GeeksforGeeks, 2021).
</p>

# Local Setup Instructions

**1. Prerequisites**

**Node.js:** v18.x or v20+ LTS

**MongoDB Atlas:** 

**OpenSSL:** Standard terminal utility

**2. Installation**

Clone the repository and install backend dependencies:
````
git clone https://github.com/samanthareddy7/HustleHubPlus.git
````

```
cd HustleHubPlus/backend
```
```
npm install
```

**3. Generate Local SSL Certificates**
Run the following command in Git Bash or Terminal inside the backend folder:

```
mkdir certificates
cd certificates
openssl req -x509 -newkey rsa:2048 -keyout privatekey.pem -out certificate.pem -days 365 -nodes -subj "/CN=localhost"
```

**4. Environment Configuration**
Create a .env file inside the backend directory based on .env.example:

```
HTTPS_PORT=4000
APP_NAME=HustleHubPlus
ENVIRONMENT_MODE=development
SSL_KEY_PATH=certificates/privatekey.pem
SSL_CERT_PATH=certificates/certificate.pem
CLIENT_ORIGIN=https://localhost:5173
JWT_SECRET=secret key
JWT_EXPIRES_IN=1h
BCRYPT_ROUNDS=12
MONGO_URI=<your MongoDB Atlas connection string>
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


#  

INSY7314 Part 1 

BCA 3 

Group 1

Group 5


| Team Member | Student Number | 
|------|------|
| Abdullah Essack | ST10249469 |
| Muhammad Hoosen	| ST10450812 |
| Samantha Reddy | ST10454507 |
| Zahraa Goga | ST10445649 |

