/*
Author: Bootstrap
Date Accessed: 11 October 2026
Link: https://getbootstrap.com/docs/5.3/examples/heroes/
Reason: Used to design the hero section of the home page.
*/

import { Link } from "react-router-dom";

function Home() {
    const token = 
        sessionStorage.getItem("clientToken") || 
        sessionStorage.getItem("freelancerToken") || 
        sessionStorage.getItem("token") || 
        sessionStorage.getItem("user");
        
    const isAuthenticated = Boolean(token);

    return (
        <div className="container py-5">
            
            <div className="row align-items-center min-vh-75 py-4">
                <div className="col-lg-7 text-center text-lg-start">

                    <h1 className="display-3 fw-bold text-dark mb-4">
                        Connect, Create, & Grow with <span className="text-primary">HustleHub+</span>
                    </h1>

                    <p className="lead text-secondary mb-4">
                        {isAuthenticated 
                            ? "Welcome back! Ready to explore available gigs, manage your active bookings, or review your financial dashboard?" 
                            : "Whether you are looking to hire top-tier talent for your business or showcase your professional skills to the world, HustleHub+ handles everything from secure bookings to automated tax tracking."}
                    </p>

                    <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3 mt-4">
                        <Link
                            to="/gigs"
                            className="btn btn-primary btn-lg px-4 py-3 shadow"
                            style={{ background: 'linear-gradient(135deg, #1d1d1d 0%, #787878 100%)' }}
                        >
                            Explore Available Gigs
                        </Link>

                      
                        {isAuthenticated ? (
                            <Link
                                to="/profile"
                                className="btn btn-outline-primary btn-lg px-4 py-3"
                            >
                                View My Profile
                            </Link>
                        ) : (
                            <Link
                                to="/register"
                                className="btn btn-outline-dark btn-lg px-4 py-3"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>

                    <div className="row mt-5 pt-3 text-start border-top g-3">
                        <div className="col-4">
                            <h4 className="fw-bold text-primary mb-0">100%</h4>
                            <small className="text-muted">Secure Payments</small>
                        </div>
                        <div className="col-4">
                            <h4 className="fw-bold text-primary mb-0">Fast</h4>
                            <small className="text-muted">Instant Bookings</small>
                        </div>
                        <div className="col-4">
                            <h4 className="fw-bold text-primary mb-0">Smart</h4>
                            <small className="text-muted">Income & Tax Tools</small>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5 mt-5 mt-lg-0">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)' }}>
                        <div className="card-body p-5">
                            <div className="d-flex align-items-center mb-4">
                            
                                <div>
                                    <h3 className="card-title fw-bold mb-1">Why HustleHub+?</h3>
                                    <p className="text-muted small mb-0">Engineered for performance and security</p>
                                </div>
                            </div>

                            <ul className="list-unstyled mb-0">
                                <li className="d-flex align-items-center mb-3">
                                    <span className="badge bg-success bg-opacity-10 text-success p-2 rounded-circle me-3">✓</span>
                                    <span><strong>Secure JWT Auth</strong> & role-based access control</span>
                                </li>
                                <li className="d-flex align-items-center mb-3">
                                    <span className="badge bg-success bg-opacity-10 text-success p-2 rounded-circle me-3">✓</span>
                                    <span>Dedicated <strong>Client & Freelancer</strong> dashboards</span>
                                </li>
                                <li className="d-flex align-items-center mb-3">
                                    <span className="badge bg-success bg-opacity-10 text-success p-2 rounded-circle me-3">✓</span>
                                    <span>Seamless <strong>gig management</strong> & publishing</span>
                                </li>
                                <li className="d-flex align-items-center mb-3">
                                    <span className="badge bg-success bg-opacity-10 text-success p-2 rounded-circle me-3">✓</span>
                                    <span>Streamlined <strong>online booking</strong> workflow</span>
                                </li>
                                <li className="d-flex align-items-center">
                                    <span className="badge bg-success bg-opacity-10 text-success p-2 rounded-circle me-3">✓</span>
                                    <span>Real-time <strong>income & tax estimation</strong></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;