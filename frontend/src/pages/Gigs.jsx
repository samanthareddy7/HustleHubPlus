import { useEffect, useState } from "react";
import { getGigs, createBooking } from "../services/api";

function Gigs() {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [selectedGig, setSelectedGig] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        loadGigs();
    }, []);

    const loadGigs = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getGigs();

            setGigs(data.gigs || []);
        } catch (err) {
            console.error("Failed to load gigs:", err);
            setError(
                err.message || "Unable to load gigs."
            );
        } finally {
            setLoading(false);
        }
    };

    // Opens the confirmation UI
    const handleBookClick = (gig) => {
        setError("");
        setSuccess("");
        setSelectedGig(gig);
    };

    // Closes confirmation UI
    const handleCancelBooking = () => {
        if (!bookingLoading) {
            setSelectedGig(null);
        }
    };

    // Actually creates the booking
    const handleConfirmBooking = async () => {
        if (!selectedGig) {
            return;
        }

        try {
            setBookingLoading(true);
            setError("");
            setSuccess("");

            const data = await createBooking(selectedGig._id);

            setSuccess(
                data.message || "Booking created successfully!"
            );

            // Close confirmation
            setSelectedGig(null);

        } catch (err) {
            console.error("Booking error:", err);

            setError(
                err.message ||
                "Unable to create booking. Please try again."
            );
        } finally {
            setBookingLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return `R${Number(amount || 0).toFixed(2)}`;
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

                <p className="text-muted mt-3">
                    Loading available gigs...
                </p>
            </div>
        );
    }

    return (
        <div className="container py-5">

            {/* PAGE HEADER */}
            <div className="mb-4">
                <h1 className="fw-bold">
                    Browse Gigs
                </h1>

                <p className="text-muted">
                    Find a freelancer and book a service.
                </p>
            </div>

            {error && (
                <div
                    className="alert alert-danger alert-dismissible"
                    role="alert"
                >
                    <strong>Something went wrong:</strong>{" "}
                    {error}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError("")}
                    />
                </div>
            )}

            {success && (
                <div
                    className="alert alert-success alert-dismissible"
                    role="alert"
                >
                    <strong>✓ Booking confirmed!</strong>{" "}
                    {success}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSuccess("")}
                    />
                </div>
            )}

            {gigs.length === 0 ? (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <div className="display-4 mb-3">
                            🔎
                        </div>

                        <h4>No gigs available</h4>

                        <p className="text-muted">
                            There are currently no active gigs available.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="row g-4">

                    {gigs.map((gig) => (
                        <div
                            className="col-md-6 col-lg-4"
                            key={gig._id}
                        >
                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body d-flex flex-column">

                                    <span className="badge bg-light text-dark align-self-start mb-2">
                                        {gig.category}
                                    </span>

                                    <h5 className="fw-bold">
                                        {gig.title}
                                    </h5>

                                    <p className="text-muted flex-grow-1">
                                        {gig.description}
                                    </p>

                                    <div className="mb-3">
                                        <small className="text-muted">
                                            Freelancer
                                        </small>

                                        <div>
                                            <strong>
                                                {gig.freelancer?.name ||
                                                    "Freelancer"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">

                                        <h5 className="fw-bold mb-0">
                                            {formatCurrency(gig.price)}
                                        </h5>

                                        <button
                                            className="btn btn-primary"
                                            onClick={() =>
                                                handleBookClick(gig)
                                            }
                                        >
                                            Book Now
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            )}

            {selectedGig && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    role="dialog"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    }}
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        role="document"
                    >
                        <div className="modal-content border-0 shadow">

                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">
                                    Confirm Booking
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCancelBooking}
                                    disabled={bookingLoading}
                                />
                            </div>

                            <div className="modal-body">

                                <p>
                                    Are you sure you want to book this
                                    gig?
                                </p>

                                <div className="bg-light rounded p-3">

                                    <h5 className="fw-bold mb-2">
                                        {selectedGig.title}
                                    </h5>

                                    <p className="text-muted mb-2">
                                        {selectedGig.description}
                                    </p>

                                    <div className="d-flex justify-content-between">
                                        <span>
                                            Category
                                        </span>

                                        <strong>
                                            {selectedGig.category}
                                        </strong>
                                    </div>

                                    <div className="d-flex justify-content-between mt-2">
                                        <span>
                                            Freelancer
                                        </span>

                                        <strong>
                                            {selectedGig.freelancer?.name ||
                                                "Freelancer"}
                                        </strong>
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between">
                                        <strong>
                                            Booking Amount
                                        </strong>

                                        <strong className="text-primary">
                                            {formatCurrency(
                                                selectedGig.price
                                            )}
                                        </strong>
                                    </div>

                                </div>

                                <div className="alert alert-info mt-3 mb-0">
                                    This is a simulated booking.
                                    No real payment will be processed.
                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={handleCancelBooking}
                                    disabled={bookingLoading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleConfirmBooking}
                                    disabled={bookingLoading}
                                >
                                    {bookingLoading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            />

                                            Processing...
                                        </>
                                    ) : (
                                        "Confirm Booking"
                                    )}
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Gigs;