import { useEffect, useState } from "react";
import {
    getMyGigs,
    deleteGig
} from "../services/api";

function MyGigs() {

    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const loadGigs = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyGigs();

            setGigs(data.gigs || []);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGigs();
    }, []);

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this gig?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);
            setError("");
            setMessage("");

            const data = await deleteGig(id);

            setMessage(
                data.message || "Gig deleted successfully."
            );

            // Remove deleted gig from the screen
            setGigs((currentGigs) =>
                currentGigs.filter(
                    (gig) => gig._id !== id
                )
            );

        } catch (err) {
            setError(err.message);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">

                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>

                <p className="mt-3">
                    Loading your gigs...
                </p>

            </div>
        );
    }

    return (
        <div className="container py-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h1 className="fw-bold">
                        My Gigs
                    </h1>

                    <p className="text-muted mb-0">
                        Manage the services you offer on HustleHub+.
                    </p>
                </div>

                <a
                    href="/gigs/create"
                    className="btn btn-primary"
                >
                    + Create Gig
                </a>

            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {message && (
                <div className="alert alert-success">
                    {message}
                </div>
            )}

            {gigs.length === 0 ? (

                <div className="card shadow-sm">
                    <div className="card-body text-center py-5">

                        <h5>
                            You haven't created any gigs yet.
                        </h5>

                        <p className="text-muted">
                            Create your first gig to start
                            offering your services.
                        </p>

                        <a
                            href="/gigs/create"
                            className="btn btn-primary"
                        >
                            Create Your First Gig
                        </a>

                    </div>
                </div>

            ) : (

                <div className="row g-4">

                    {gigs.map((gig) => (

                        <div
                            className="col-md-6 col-lg-4"
                            key={gig._id}
                        >

                            <div className="card h-100 shadow-sm">

                                <div className="card-body d-flex flex-column">

                                    <div className="d-flex justify-content-between align-items-start">

                                        <h5 className="card-title fw-bold">
                                            {gig.title}
                                        </h5>

                                        <span
                                            className={`badge ${
                                                gig.isActive
                                                    ? "text-bg-success"
                                                    : "text-bg-secondary"
                                            }`}
                                        >
                                            {gig.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                    </div>

                                    <span className="badge text-bg-light border align-self-start mb-3">
                                        {gig.category}
                                    </span>

                                    <p className="card-text text-muted">
                                        {gig.description}
                                    </p>

                                    <div className="mt-auto">

                                        <hr />

                                        <div className="d-flex justify-content-between align-items-center mb-3">

                                            <span className="text-muted">
                                                Price
                                            </span>

                                            <strong className="fs-5">
                                                R{Number(gig.price).toFixed(2)}
                                            </strong>

                                        </div>

                                        <div className="d-flex gap-2">

                                            <a
                                                href={`/gigs/edit/${gig._id}`}
                                                className="btn btn-outline-primary flex-fill"
                                            >
                                                Edit
                                            </a>

                                            <button
                                                className="btn btn-outline-danger flex-fill"
                                                onClick={() =>
                                                    handleDelete(gig._id)
                                                }
                                                disabled={
                                                    deletingId === gig._id
                                                }
                                            >
                                                {deletingId === gig._id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default MyGigs;