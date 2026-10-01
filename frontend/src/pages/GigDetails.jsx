import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGigById, createBooking, getSavedUser } from "../services/api";

function GigDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [booking, setBooking] = useState(false);
    const [bookingMessage, setBookingMessage] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);

    const user = getSavedUser();


    useEffect(() => {

        const loadGig = async () => {

            try {

                setLoading(true);
                setError("");

                const data = await getGigById(id);

                setGig(data.gig);

            } catch (err) {

                setError(
                    err.message ||
                    "Unable to load this gig."
                );

            } finally {

                setLoading(false);
            }
        };

        loadGig();

    }, [id]);


    //open booking ocnfirmation
    const handleBookClick = () => {

        setBookingMessage("");
        setShowConfirmation(true);
    };

    //confirms booking
    const handleConfirmBooking = async () => {

        try {

            setBooking(true);
            setBookingMessage("");

            await createBooking(gig._id);

            setShowConfirmation(false);

            setBookingMessage(
                "Booking created successfully!"
            );

        } catch (err) {

            setBookingMessage(
                err.message ||
                "Unable to create booking."
            );

        } finally {

            setBooking(false);
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
                    Loading gig details...
                </p>

            </div>
        );
    }

    if (error || !gig) {

        return (
            <div className="container py-5">

                <div className="alert alert-danger">
                    {error || "Gig not found."}
                </div>

                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/gigs")}
                >
                    ← Back to Gigs
                </button>

            </div>
        );
    }

    //checks user role
    const isLoggedIn = Boolean(user);
    const isClient = user?.role === "client";

    const isGigOwner =
        user?.role === "freelancer" &&
        user?.id === gig.freelancer?._id;


    return (
        <div className="container py-5">

            
            <button
                className="btn btn-outline-secondary mb-4"
                onClick={() => navigate("/gigs")}
            >
                ← Back to Gigs
            </button>


            <div className="row justify-content-center">

                <div className="col-lg-9">

                    <div className="card shadow-sm border-0">

                        <div className="card-body p-4 p-md-5">

                            
                            <div className="d-flex justify-content-between align-items-start mb-4">

                                <div>

                                    <span className="badge bg-primary mb-3">
                                        {gig.category}
                                    </span>

                                    <h1 className="fw-bold mb-2">
                                        {gig.title}
                                    </h1>

                                    <p className="text-muted mb-0">
                                        Service offered by{" "}
                                        <strong>
                                            {gig.freelancer?.name ||
                                                "Freelancer"}
                                        </strong>
                                    </p>

                                </div>

                                <div className="text-end">

                                    <div className="text-muted small">
                                        Price
                                    </div>

                                    <div className="fs-2 fw-bold text-primary">
                                        R{Number(gig.price).toFixed(2)}
                                    </div>

                                </div>

                            </div>


                            <hr />


                            <section className="mb-5">

                                <h4 className="fw-bold mb-3">
                                    About this service
                                </h4>

                                <p
                                    className="text-secondary"
                                    style={{
                                        whiteSpace: "pre-wrap"
                                    }}
                                >
                                    {gig.description}
                                </p>

                            </section>


                            <section className="mb-5">

                                <h4 className="fw-bold mb-3">
                                    About the Freelancer
                                </h4>

                                <div className="card bg-light border-0">

                                    <div className="card-body">

                                        <h5 className="fw-bold mb-1">
                                            {gig.freelancer?.name ||
                                                "Freelancer"}
                                        </h5>

                                        <p className="text-muted mb-0">
                                            {gig.category}
                                        </p>

                                    </div>

                                </div>

                            </section>


                            <section className="mb-4">

                                <h4 className="fw-bold mb-3">
                                    Gig Information
                                </h4>

                                <div className="row g-3">

                                    <div className="col-md-4">

                                        <div className="border rounded p-3 h-100">

                                            <small className="text-muted">
                                                Category
                                            </small>

                                            <div className="fw-semibold">
                                                {gig.category}
                                            </div>

                                        </div>

                                    </div>


                                    <div className="col-md-4">

                                        <div className="border rounded p-3 h-100">

                                            <small className="text-muted">
                                                Price
                                            </small>

                                            <div className="fw-semibold">
                                                R{Number(gig.price).toFixed(2)}
                                            </div>

                                        </div>

                                    </div>


                                    <div className="col-md-4">

                                        <div className="border rounded p-3 h-100">

                                            <small className="text-muted">
                                                Availability
                                            </small>

                                            <div>

                                                {gig.isActive ? (
                                                    <span className="badge bg-success">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-secondary">
                                                        Inactive
                                                    </span>
                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </section>


                            {bookingMessage && (
                                <div
                                    className="alert alert-success mt-4"
                                    role="alert"
                                >
                                    {bookingMessage}

                                    <div className="mt-2">

                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() =>
                                                navigate("/my-bookings")
                                            }
                                        >
                                            View My Bookings
                                        </button>

                                    </div>

                                </div>
                            )}


                           
                            <div className="d-flex gap-2 mt-4">

                                
                                {isClient && gig.isActive && (
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={handleBookClick}
                                        disabled={booking}
                                    >
                                        Book This Service
                                    </button>
                                )}


                                {!isLoggedIn && (
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={() => navigate("/login")}
                                    >
                                        Login to Book
                                    </button>
                                )}


                                {isGigOwner && (
                                    <button
                                        className="btn btn-outline-primary btn-lg"
                                        onClick={() =>
                                            navigate(
                                                `/gigs/edit/${gig._id}`
                                            )
                                        }
                                    >
                                        Edit My Gig
                                    </button>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {showConfirmation && (

                <div
                    className="modal d-block"
                    tabIndex="-1"
                    role="dialog"
                    style={{
                        backgroundColor:
                            "rgba(0, 0, 0, 0.5)"
                    }}
                >

                    <div
                        className="modal-dialog modal-dialog-centered"
                        role="document"
                    >

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title">
                                    Confirm Booking
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() =>
                                        setShowConfirmation(false)
                                    }
                                    disabled={booking}
                                />

                            </div>


                            <div className="modal-body">

                                <h5 className="fw-bold">
                                    {gig.title}
                                </h5>

                                <p className="text-muted">
                                    {gig.description}
                                </p>

                                <hr />

                                <div className="d-flex justify-content-between">

                                    <span>
                                        Category
                                    </span>

                                    <strong>
                                        {gig.category}
                                    </strong>

                                </div>

                                <div className="d-flex justify-content-between mt-2">

                                    <span>
                                        Freelancer
                                    </span>

                                    <strong>
                                        {gig.freelancer?.name ||
                                            "Freelancer"}
                                    </strong>

                                </div>

                                <div className="d-flex justify-content-between mt-2">

                                    <span>
                                        Booking Amount
                                    </span>

                                    <strong>
                                        R{Number(gig.price).toFixed(2)}
                                    </strong>

                                </div>

                                <div className="alert alert-info mt-4 mb-0">

                                    This is a simulated booking.
                                    No real payment will be processed.

                                </div>

                            </div>


                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setShowConfirmation(false)
                                    }
                                    disabled={booking}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleConfirmBooking}
                                    disabled={booking}
                                >

                                    {booking ? (
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

export default GigDetails;

