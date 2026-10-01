import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="container py-5">

            <div className="row align-items-center">

                <div className="col-lg-7">

                    <h1 className="display-4 fw-bold">
                        Welcome to HustleHub+
                    </h1>

                    <p className="lead mt-3">
                        A secure freelance marketplace connecting clients
                        with talented freelancers.
                    </p>

                    <p className="text-muted">
                        Browse services, book freelancers, manage gigs,
                        and track your freelance income.
                    </p>

                    <div className="mt-4">

                        <Link
                            to="/gigs"
                            className="btn btn-primary btn-lg me-2"
                        >
                            Browse Gigs
                        </Link>

                        <Link
                            to="/register"
                            className="btn btn-outline-primary btn-lg"
                        >
                            Get Started
                        </Link>

                    </div>

                </div>

                <div className="col-lg-5 mt-5 mt-lg-0">

                    <div className="card shadow border-0">
                        <div className="card-body p-4">

                            <h3 className="card-title">
                                Why HustleHub+?
                            </h3>

                            <ul className="mt-3">
                                <li className="mb-2">
                                    Secure JWT authentication
                                </li>

                                <li className="mb-2">
                                    Freelancer and client accounts
                                </li>

                                <li className="mb-2">
                                    Secure gig management
                                </li>

                                <li className="mb-2">
                                    Online booking system
                                </li>

                                <li className="mb-2">
                                    Income and tax tracking
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