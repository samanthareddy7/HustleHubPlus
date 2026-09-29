import {useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import {registerUser} from '../services/api'


function Register() {

    const navigate = useNavigate();

    //storing the current value entered input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const handleSubmit = async (
        event
    ) => {

        /*html handles the form normally
        html form reload/navigate the browser when sent
        
        prevent default? = store the behaviour because react will handle the submission by itself*/
        event.preventDefault();
        setError('');


        if (!name || !email || !password) {
            setError("Please complete all required fields.");
            return;
        }

        setLoading(true);

        try{

            await registerUser({
                name,
                email,
                password
            });
            
            navigate("/login");


        }catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    };

return (
        <div className="auth-page">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-7 col-lg-5">
                        <div className="card shadow-lg border-0 auth-card">

                            <div className="card-body p-5">

                                <div className="text-center mb-4">

                                    <h1 className="fw-bold">
                                        Join HustleHub+
                                    </h1>

                                    <p className="text-muted">
                                        Create your freelance marketplace account
                                    </p>

                                </div>


                                {error && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        {error}
                                    </div>
                                )}


                                <form onSubmit={handleSubmit}>

                                    <div className="mb-3">

                                        <label
                                            htmlFor="name"
                                            className="form-label"
                                        >
                                            Full name
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
                                            Email address
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


                                    <div className="mb-4">

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
                                        />

                                        <div className="form-text">
                                            Use a strong password containing
                                            multiple character types.
                                        </div>

                                    </div>


                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Creating account..."
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


