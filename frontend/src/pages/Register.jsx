import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("client");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!name || !email || !password || !role) {
            setError("Please complete all fields.");
            return;
        }

        setLoading(true);

        try {

            await registerUser({
                name,
                email,
                password,
                role
            });

            setSuccess(
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="auth-page py-5">

            <div className="container">

                <div className="row justify-content-center">

                    <div className="col-md-7 col-lg-6">

                        <div className="card shadow-lg border-0">

                            <div className="card-body p-5">

                                <div className="text-center mb-4">

                                    <h1 className="fw-bold">
                                        HustleHub+
                                    </h1>

                                    <p className="text-muted">
                                        Create your account
                                    </p>

                                </div>

                                {error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success">
                                        {success}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>


                                    <div className="mb-3">

                                        <label
                                            htmlFor="name"
                                            className="form-label"
                                        >
                                            Full Name
                                        </label>

                                        <input
                                            id="name"
                                            type="text"
                                            className="form-control"
                                            value={name}
                                            onChange={(event) =>
                                                setName(event.target.value)
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="mb-3">

                                        <label
                                            htmlFor="email"
                                            className="form-label"
                                        >
                                            Email Address
                                        </label>

                                        <input
                                            id="email"
                                            type="email"
                                            className="form-control"
                                            value={email}
                                            onChange={(event) =>
                                                setEmail(event.target.value)
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="mb-3">

                                        <label
                                            htmlFor="password"
                                            className="form-label"
                                        >
                                            Password
                                        </label>

                                        <input
                                            id="password"
                                            type="password"
                                            className="form-control"
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(event.target.value)
                                            }
                                            required
                                            minLength="8"
                                        />

                                        <div className="form-text">
                                            Password must contain at least
                                            8 characters.
                                        </div>

                                    </div>


                                    <div className="mb-4">

                                        <label
                                            htmlFor="role"
                                            className="form-label"
                                        >
                                            Account Type
                                        </label>

                                        <select
                                            id="role"
                                            className="form-select"
                                            value={role}
                                            onChange={(event) =>
                                                setRole(event.target.value)
                                            }
                                        >
                                            <option value="client">
                                                Client
                                            </option>

                                            <option value="freelancer">
                                                Freelancer
                                            </option>
                                        </select>

                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Creating Account..."
                                            : "Create Account"}
                                    </button>

                                </form>

                                <div className="text-center mt-4">

                                    <span className="text-muted">
                                        Already have an account?
                                    </span>

                                    {" "}

                                    <Link to="/login">
                                        Sign in
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;
