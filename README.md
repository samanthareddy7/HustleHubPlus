

# <img width="80" height="80" alt="HustleHub" src="https://github.com/user-attachments/assets/5a42dacb-93f8-4838-a4b4-c3700bbe2323" /> HustleHub+

<p align="justify">
HustleHub+ is a secure, full-stack freelance marketplace built on the MERN stack (MongoDB, Express.js, React.js, and Node.js) that connects clients with skilled freelancers for browsing and booking specialised service gigs. The platform also integrates automated financial management tools that track client bookings, calculate freelancer gross earnings and estimate tax liabilities. Designed with security from the start, HustleHub+ protects sensitive identity and transactional data using end-to-end HTTPS encryption, bcrypt password hashing, stateless JSON Web Token (JWT) authentication, strict Role-Based Access Control, and  validation middleware to help defend against web vulnerabilities like NoSQL injection and XSS.
</p>

You can watch the demo for Part 1 here: https://youtu.be/oPwIyylQsJY 
and the demo for Part 2 here: https://youtu.be/laMGd5GxnL8 


# 1. Implemented Features

**1. Authentication and User Accounts**

HustleHub+ provides registration and login functionality for clients and freelancers.

Implemented authentication functionality includes:

- Client and freelancer registration.
- Secure user login.
- bcrypt password hashing.
- JWT generation after successful authentication.
- Protected API routes.
- Restricted public registration roles.
- Rejection of unexpected registration properties.
- Password complexity validation.
- Email validation and normalisation.
- Role-Based Access Control.

Public users cannot register themselves as administrators.

**2. Client Features**

Clients can:

- Register and log in.
- Browse active marketplace gigs.
- View gig information.
- Book an available gig.
- View their own bookings.
- View booking status information.

Clients cannot create or manage freelancer gigs, access freelancer financial information or access administrator functionality.

**3. Freelancer Features**

Freelancers can:

- Register and log in.
- Create gigs.
- View their own gigs.
- Edit gigs that they own.
- Delete eligible gigs that they own.
- View bookings made for their services.
- Complete applicable client bookings.
- View transaction history.
- View total freelancer income.
- View estimated tax.
- View net income.

Gig ownership is determined from the authenticated user's JWT rather than from a freelancer ID supplied by the frontend.

A freelancer cannot update or delete another freelancer's gig.

To protect historical booking information, gigs with existing bookings cannot be permanently deleted.

**4. Administrator Features**

Administrators have access to a protected administration dashboard.

Implemented administrative functionality includes:

- Viewing registered users.
- Viewing platform bookings.
- Viewing total number of gigs and bookings.
- Viewing the total value of completed bookings.

Moderating marketplace gigs.
- Deactivating gigs.

Administrative gig moderation does not permanently delete the gig. Instead, the gig's isActive property is set to false. This removes it from active marketplace listings while preserving the record for historical booking and transaction relationships.

Administrator endpoints are protected using authentication and role-based authorisation.

**5. Gig Management**

HustleHub+ implements gig CRUD functionality.

| Operation |  Description | 
|------|------|
| Create| Freelancers create new service listings |
| Read| Users can browse active marketplace gigs |
| Update | Freelancers can update gigs that they own |
| Delete | Freelancers can delete eligible gigs that they own |

The server determines gig ownership using the authenticated freelancer's identity.

**6. Booking Management**

Authenticated clients can book active freelancer gigs.

When a booking is submitted, the backend:
1. Verifies the authenticated user is a client.
2. Validates the supplied gig ID.
3. Retrieves the gig from MongoDB.
4. Verifies that the gig is active.
5. Prevents invalid booking operations.
6. Uses the stored gig price rather than accepting a transaction amount from the frontend.
7. Creates the booking.
8. Creates the associated simulated transaction.

This prevents users from manipulating service prices through the browser or manually constructed API requests. Freelancers can retrieve bookings associated with their services and mark applicable pending bookings as completed.

**7. Financial Tracking**

A successful booking creates an associated simulated financial transaction.

The backend calculates financial values rather than trusting values submitted by the client.

Freelancers can view a financial summary containing:
- Total income.
- Estimated tax.
- Net income.
- Transaction history.
  

# 2. Detailed Architectural Breakdown

<img width="450" height="1200" alt="secuirty updated" src="https://github.com/user-attachments/assets/76ab6d6a-0610-40e6-8ba7-9e6398f92f34" />



**1. Client Layer (User Device)**
<p align="justify">
The user-facing side of the system is the client layer, which contains the React.js frontend. This is used for building interactive user interfaces. It uses a component-based architecture to render dynamic content, capture user inputs (credentials, gig creations, and booking requests, for example), and format them into JSON payloads that are sent to the server (Devi, 2025). 
</p>
<p align="justify">
Communication starts from this layer and crosses the external network boundary through HTTPS Requests. Operating strictly outside the system's core backend, the client therefore has no direct access to application memory, internal service/utility modules or the database layer (Abod, 2023).
</p>

<p align="justify">
A central API service communicates with the Express backend.
Protected requests attach the current JWT using <code>Authorization: Bearer &lt;TOKEN&gt;</code>.
Authentication information is stored for the current browser session using sessionStorage.
Frontend route guards restrict normal navigation according to authentication state and role. These frontend controls are used for user experience and are not treated as the primary security boundary.
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

*Bookings Controller:*  Manages client booking workflows, creates simulated payment transaction records, and calculates freelancer income and estimated tax income (Shaik, 2025).

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
If the validation fails, the middleware immediately stops the request flow and returns a 400 Bad Request response with explicit validation messages. This helps to prevent incorrect or malicious data from reaching the database. If the payload passes validation, it is then transferred to the controllers, which handle data generation and orchestration. If the user exists in the system already, a 409 Conflict error is returned. If the email is unique, the user's plain-text password is sent to the service helpers to be hashed asynchronously using 12 salt rounds. Only the hashed and salted password is saved to MongoDB. Upon successful user creation, the controller calls a service class to construct a signed JSON Web Token (JWT). Finally, the server sends a 201 Created response containing the JWT and a sanitised user object that explicitly excludes sensitive fields (Sudharshan, 2026). 
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
A generated JWT consists of three parts: a header, payload and signature. The Payload contains non-sensitive identity claims, specifically the user’s userId and their assigned system role (client, freelancer or admin). The token is cryptographically signed using the HMAC SHA-256 (HS256) algorithm with a secret key. This signature guarantees data integrity (Sudharshan, 2025). If a malicious client attempts to modify their role inside the token payload (e.g., changing client to admin), the server's signature verification step will fail, invalidating the token. To access protected routes (such as creating a gig or viewing earnings), the client must attach the JWT to the HTTP request using the standardised Authorisation header with the Bearer schema: HTTP <code>Authorization: Bearer &lt;TOKEN&gt;</code> (Auth0, 2026)
</p>

<p align="justify">
An authentication middleware intercepts incoming requests, extracts the bearer token, verifies its signature using the key, and checks that the token has not expired. Once verified, the decoded payload claims are attached to the Express request object, making the user’s identity and role immediately accessible to controllers for  Role-Based Access Control evaluation (Sudharshan, 2025).
</p>

# Input Validation, Sanitisation

<p align="justify">
Input validation in HustleHub+ is applied at the start of the backend architecture using middleware. The main objective of this is to guarantee that untrusted input from external users is rigorously sanitised and checked before it can interact with application logic or the MongoDB layer. The validation pipeline enforces a strategy of strict whitelisting and regular expression matching. Names and emails are validated and trimmed for extra whitespace and normalised with accepted string casing. There is also a strict password complexity policy. This enforces a strict password check using regular expressions. This helps to ensure passwords are at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one numeric digit and one special character.
Any attempt to pass an unrecognised role string is rejected. Beyond format enforcement, this validation acts as a primary defence against NoSQL Injection and Cross-Site Scripting (XSS). By ensuring that input fields contain only valid parameters (strings, numbers) and rejecting raw query objects or script tags, the middleware prevents malicious actors from manipulating MongoDB query selectors or injecting malicious client-side code into stored database fields (Patel, 2026).

Frontend validation provides immediate user feedback, but backend validation remains authoritative because frontend validation can be bypassed.
</p>

# 3. Security Rationale & Implementation Decisions

  
***1. Transport Layer Security (HTTPS)***
<p align="justify">
The API relies on HTTPS generated by Node's native https module and TLS connections to MongoDB Atlas. For this system, which deals with gig management and booking financials, managing sensitive data, transaction records and tax estimates protects user credentials and payload data from Man-in-the-Middle attacks. Encrypting traffic in transit protects confidentiality and data integrity across untrusted public networks (Chaudary, 2025).
</p>

***2. Password Hashing (bcrypt)***
<p align="justify">
Storing passwords in plain text or using fast cryptographic hash functions (such as MD5, SHA-1, or SHA-256) leaves user credentials vulnerable to rainbow table lookups and rapid brute-force attacks if a database breach occurs. bcrypt incorporates dynamic salt generation and key stretching, making offline brute-force attempts computationally expensive and time-prohibitive for attackers (Dias, 2024).
</p>

***3. Token-Based Authentication (JSON Web Tokens)***
<p align="justify">
Authentication is stateless through JWTs passed in the HTTP <code>Authorization: Bearer &lt;TOKEN&gt;</code> header instead of server-side session cookies. 
Stateless tokens avoid session storage overhead on the server. Claims inside the payload (id and role) allow for fast Role-based access control evaluation on protected endpoints without requiring a database read on every request (GeeksforGeeks, 2021).
</p>

***4. Resource Ownership***
<p align="justify">
Role checking alone is insufficient for freelancer resources because two users can both have the freelancer role. HustleHub+ therefore performs ownership checks when protected gig operations are requested, using JWT to verify resource ownership.
For example, a freelancer attempting to update or delete a gig belonging to another freelancer is rejected.

Permanent deletion of a gig is restricted when existing bookings reference that gig. This prevents historical booking records from containing broken gig references. Administrative moderation therefore uses deactivation rather than deletion where a listing needs to be removed from the marketplace.
</p>

***5. Rate Limiting***
<p align="justify">
HustleHub+ uses express-rate-limit to reduce automated abuse and excessive requests against the API. Rather than applying the same restriction to every operation, the backend implements separate rate limiters for general API traffic, authentication operations and booking creation.

The general API limiter allows a maximum of 100 requests within a 15-minute window. This provides a baseline level of protection across the API against excessive traffic for development.

Authentication operations use a stricter limit of 10 requests per 15 minutes. Registration and login endpoints are particularly sensitive because repeated authentication attempts can be used for credential guessing or brute-force attacks. Restricting the number of authentication requests makes high-volume automated attempts more difficult.

Booking creation is protected by a separate limit of 20 requests per 15 minutes. This helps prevent an authenticated client from rapidly generating large numbers of bookings and associated simulated transaction records.
</p>


When a rate limit is exceeded, the backend returns HTTP `429 Too Many Requests`

A controlled JSON error response is returned rather than an internal server error. For example:

```
{
  "success": false,
  "error": "Too many auth requests. Try again later.",
  "retryAfterSeconds": 600
}
```
<p align="justify">
The rate limiters use standard rate-limit response headers and disable the older legacy headers.

Rate limiting is skipped when <code>NODE_ENV</code> is set to test. This prevents the automated test suite from failing simply because a large number of legitimate test requests are executed consecutively. The security control therefore remains enabled for normal development/application use while allowing repeatable automated testing; this is explained further in the setup section.

Rate limiting forms an additional layer of defence by controlling how frequently sensitive operations can be attempted.
</p>

***6. Security Headers and Content Security Policy***
<p align="justify">
HustleHub+ uses Helmet middleware to configure HTTP security headers returned by the Express backend. Security headers provide an additional browser-facing security layer by restricting how browsers are permitted to interpret or use application resources. Helmet is applied globally so that security-related headers are consistently included in API responses.
The CSP works alongside the other security headers supplied by Helmet. It provides another layer of browser-side restrictions if unsafe content reaches a client.
</p>

***Cross-Origin Resource Sharing (CORS)***

The React frontend and Express backend run on different origins during local development. 
Because the scheme and port differ, browsers treat these as different origins. HustleHub+ therefore uses CORS configuration to explicitly control which frontend origin is permitted to make cross-origin API requests.

The permitted frontend origin is read from the environment:
```
CLIENT_ORIGIN=http://localhost:5173
```

The CORS configuration permits the HTTP methods required by the implemented API:
```
GET
POST
PUT
PATCH
DELETE
OPTIONS
```
Request headers are restricted to:
```
Content-Type
Authorization
```
Content-Type is required for JSON API requests, while Authorisation is required for protected requests containing the JWT Bearer token.

The configuration also uses: `credentials: false` because HustleHub+ does not rely on cross-origin cookies for authentication. Authentication is performed using JWT Bearer tokens sent through the Authorisation header.

Restricting the allowed origin means the API does not simply respond with a wildcard configuration such as:
```
Access-Control-Allow-Origin: *
```
Instead, browser-based cross-origin access is limited to the explicitly configured frontend origin. CORS is a browser-enforced cross-origin control, not a replacement for API authentication or authorisation. A malicious user can still attempt to call an API using tools outside a browser. For this reason, protected HustleHub+ endpoints independently enforce JWT authentication, RBAC and ownership rules.


# 4. Local Setup Instructions

***1. Prerequisites***

**Node.js:** v18.x or v20+ LTS

**MongoDB Atlas:** 

**OpenSSL:** Standard terminal utility

***2. Installation***

Clone the repository and install backend dependencies:
````
git clone https://github.com/EMKNDW/insy7314-g1-2026-insy7314-2026-poe-st10445649.git
````

```
cd backend
```
```
npm install
```

***3. Backend Setup***

Dependencies: 

The exact dependency versions are defined in the backend package.json.
Important backend dependencies include the packages used for:
- Express.js
- Mongoose
- bcrypt
- JSON Web Tokens
- input validation
- Helmet security headers
- CORS
- rate limiting
- environment variable configuration

Running npm install installs the versions specified by the project.

**Generate Local SSL Certificates**
Run the following command in Git Bash or Terminal inside the backend folder:

```
mkdir certificates
cd certificates
openssl req -x509 -nodes -newkey rsa:2048 -sha256 -keyout certificates/privatekey.pem -out certificates/certificate.pem -days 365 -subj "/C=ZA/ST=KwaZulu-Natal/L=Durban/O=HustleHub/OU=Development/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

**Environment Configuration**
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

**Running the Application**

Start local MongoDB, then run:

# Development Mode 
```
npm run dev
```

# Production Mode
```
npm start
```
The HTTPS server will start on https://localhost:4000.


***4. Frontend Setup***

Open another terminal and navigate to the frontend directory:

```
cd frontend
```

Install frontend dependencies:
```
npm install
```

The frontend uses React with Vite together with the project's UI and routing dependencies.

**Environment Configuration**
Create a .env file inside the frontend directory:

```
VITE_API_URL:https://localhost:4000
```
The frontend API service must point to the HTTPS backend:

```
https://localhost:4000
```

The frontend development server normally runs at:

```
http://localhost:5173
```

**Running the Frontend**

From the frontend directory:

```
npm run dev
```

Open the URL:  `http://localhost:5173`

The backend and frontend must both be running for the complete application to function.

***5. Running API Tests***

HustleHub+ includes an automated Postman collection covering successful operations, validation failures, authentication failures and role-based security restrictions.

***1. Running with Postman***

**Running in Postman** 
1. Start the HustleHub+ backend.
2. Open Postman.
3. Import the HustleHub+ Postman collection.
4. Confirm the collection baseUrl is:
```
https://localhost:4000
```
5. Run the collection using Postman's Collection Runner.

The collection generates the authentication information and resource identifiers required by later requests during the test workflow.

**Running with Newman**
1. Run the backend in TEST mode

```
NODE_ENV=test npm start
```
2. Open a new terminal and navigate to the postman folder

```
cd postman
```
3. Run the tests

```
npx newman run HustleHub.postman_collection.json --insecure
```


***2. Running Frontend Tests***

1. Install frontend dependencies first:

```
cd frontend
npm install
```

2. Run the frontend test command configured in the frontend package.json:

```
npm test
```


# Project Security Summary

HustleHub+ follows a defence-in-depth approach rather than relying on a single security control.

```
HTTPS
  ↓
Security Headers / CORS / Rate Limiting
  ↓
Input Validation and Sanitisation
  ↓
JWT Authentication
  ↓
Role-Based Access Control
  ↓
Resource Ownership Checks
  ↓
Business Logic Validation
  ↓
Mongoose
  ↓
MongoDB
```

Frontend route protection improves the user experience by preventing normal navigation to incorrect functionality. However, security-sensitive decisions are independently enforced by the backend.

This means manually changing a frontend URL, hiding or enabling a button, modifying browser state or constructing an HTTP request does not grant a user additional backend permissions.

# Project Information

INSY7314 Part 2 

BCA 3 

Group 1

Group 5


| Team Member | Student Number | 
|------|------|
| Abdullah Essack | ST10249469 |
| Muhammad Hoosen	| ST10450812 |
| Samantha Reddy | ST10454507 |
| Zahraa Goga | ST10445649 |

