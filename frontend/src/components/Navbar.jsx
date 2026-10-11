/*
Author: Bootstrap
Date Accessed: 11 October 2026
Link: https://getbootstrap.com/docs/5.3/components/navbar/
Reason: Used to build the responsive Bootstrap navigation bar with the collapse toggler.
*/
/*
Author: React Router
Date Accessed: 11 October 2026
Link: https://reactrouter.com/api/hooks/useNavigate
Reason: Used useNavigate to redirect the user to the login page after logging out.
*/

import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const token = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");

    let user = null;

    try {
        user = savedUser ? JSON.parse(savedUser) : null;
    } catch {
        user = null;
    }

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container">

                <Link className="navbar-brand fw-bold" to="/">
                    HustleHub+
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">

                    <ul className="navbar-nav me-auto">

                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/gigs">
                                Browse Gigs
                            </Link>
                        </li>

                        {token && user?.role === "client" && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard">
                                    Dashboard
                                </Link>
                            </li>
                        )}

                        {token && user?.role === "freelancer" && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard">
                                    Dashboard
                                </Link>
                            </li>
                        )}
                                                {token && user?.role === "admin" && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin">
                                    Admin
                                </Link>
                            </li>
                        )}

                    </ul>

                    <div className="d-flex align-items-center">

                        {!token ? (
                            <>
                                <Link
                                    className="btn btn-outline-light me-2"
                                    to="/login"
                                >
                                    Login
                                </Link>

                                <Link
                                    className="btn btn-light"
                                    to="/register"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <span className="text-white me-3">
                                    Hi, {user?.name}
                                </span>

                                <button
                                    className="btn btn-outline-light"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        )}

                    </div>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;