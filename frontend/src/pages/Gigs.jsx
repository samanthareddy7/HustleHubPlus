import { useEffect, useState } from "react";
import { getGigs, createBooking } from "../services/api";

function Gigs() {

    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bookingId, setBookingId] = useState(null);
    const [message, setMessage] = useState("");

    const loadGigs = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getGigs();

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

    const handleBook = async (gigId) => {

        try {
            setBookingId(gigId);
            setMessage("");
            setError("");

            const data = await createBooking(gigId);

            setMessage(
                data.message || "Gig booked successfully."
            );

        } catch (err) {
            setError(err.message);
        } finally {
            setBookingId(null);
        }
    };

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="mt-3">
                        Loading gigs...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">

            <div className="mb-4">
                <h1 className="fw-bold">
                    Browse Gigs
                </h1>

                <p className="text-muted">
                    Find a freelancer for your next project.
                </p>
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
                <div className="alert alert-info">
                    No gigs are currently available.
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

                                    <div className="d-flex justify-content-between align-items-start mb-2">

                                        <h5 className="card-title fw-bold">
                                            {gig.title}
                                        </h5>

                                        <span className="badge text-bg-primary">
                                            {gig.category}
                                        </span>

                                    </div>

                                    <p className="card-text text-muted">
                                        {gig.description}
                                    </p>

                                    <div className="mt-auto">

                                        <hr />

                                        <div className="d-flex justify-content-between align-items-center">

                                            <div>
                                                <small className="text-muted">
                                                    Freelancer
                                                </small>

                                                <div className="fw-semibold">
                                                    {gig.freelancer?.name}
                                                </div>
                                            </div>

                                            <div className="text-end">
                                                <small className="text-muted">
                                                    Price
                                                </small>

                                                <div className="fw-bold fs-5">
                                                    R{Number(gig.price).toFixed(2)}
                                                </div>
                                            </div>

                                        </div>

                                        <button
                                            className="btn btn-primary w-100 mt-3"
                                            onClick={() => handleBook(gig._id)}
                                            disabled={bookingId === gig._id}
                                        >
                                            {bookingId === gig._id
                                                ? "Booking..."
                                                : "Book Now"}
                                        </button>

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

export default Gigs;