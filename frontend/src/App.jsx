import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";

import "./App.css";

function Home() {
    return (
        <div className="container py-5">

            <div className="text-center">

                <h1 className="display-4 fw-bold">
                    Welcome to HustleHub+
                </h1>

                <p className="lead text-muted mt-3">
                    A secure freelance marketplace for clients and freelancers.
                </p>

                <div className="mt-4">

                    <Link
                        to="/login"
                        className="btn btn-primary btn-lg me-2"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="btn btn-outline-primary btn-lg"
                    >
                        Register
                    </Link>

                </div>

            </div>

        </div>
    );
}


function App() {

    return (
        <BrowserRouter>

            <nav className="navbar navbar-expand-lg bg-primary navbar-dark">

                <div className="container">

                    <Link
                        className="navbar-brand fw-bold"
                        to="/"
                    >
                        HustleHub+
                    </Link>

                    <div className="navbar-nav ms-auto">

                        <Link
                            className="nav-link"
                            to="/login"
                        >
                            Login
                        </Link>

                        <Link
                            className="nav-link"
                            to="/register"
                        >
                            Register
                        </Link>

                    </div>

                </div>

            </nav>


            <main>

                <Routes>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                </Routes>

            </main>

        </BrowserRouter>
    );
}

export default App;