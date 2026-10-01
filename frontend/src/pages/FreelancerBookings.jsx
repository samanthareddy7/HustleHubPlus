import { useEffect, useState } from "react";
import {
    getFreelancerBookings,
    completeBooking
} from "../services/api";

function FreelancerBookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [completingId, setCompletingId] = useState(null);

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getFreelancerBookings();

            setBookings(data.bookings || []);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handleComplete = async (id) => {

        const confirmed = window.confirm(
            "Mark this booking as completed?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setCompletingId(id);
            setError("");
            setMessage("");

            const data = await completeBooking(id);

            setMessage(
                data.message || "Booking completed successfully."
            );

            // Update the booking immediately
            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking._id === id
                        ? {
                            ...booking,
                            status: "Completed"
                        }
                        : booking
                )
            );

        } catch (err) {
            setError(err.message);
        } finally {
            setCompletingId(null);
        }
    };

    const getStatusClass = (status) => {

        switch (status) {

            case "Completed":
                return "text-bg-success";

            case "Cancelled":
                return "text-bg-danger";

            default:
                return "text-bg-warning";
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
                    Loading bookings...
                </p>

            </div>
        );
    }

    return (
        <div className="container py-5">

            <div className="mb-4">

                <h1 className="fw-bold">
                    Client Bookings
                </h1>

                <p className="text-muted">
                    Manage services booked by your clients.
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

            {bookings.length === 0 ? (

                <div className="card shadow-sm">

                    <div className="card-body text-center py-5">

                        <h5>
                            No bookings yet.
                        </h5>

                        <p className="text-muted">
                            Client bookings will appear here.
                        </p>

                    </div>

                </div>

            ) : (

                <div className="card shadow-sm">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>
                                    <th>Gig</th>
                                    <th>Client</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>

                            </thead>

                            <tbody>

                                {bookings.map((booking) => (

                                    <tr key={booking._id}>

                                        <td>

                                            <div className="fw-semibold">
                                                {booking.gig?.title}
                                            </div>

                                            <small className="text-muted">
                                                {booking.gig?.category}
                                            </small>

                                        </td>

                                        <td>

                                            <div className="fw-semibold">
                                                {booking.client?.name}
                                            </div>

                                            <small className="text-muted">
                                                {booking.client?.email}
                                            </small>

                                        </td>

                                        <td>
                                            <strong>
                                                R{Number(
                                                    booking.amount
                                                ).toFixed(2)}
                                            </strong>
                                        </td>

                                        <td>

                                            <span
                                                className={`badge ${getStatusClass(
                                                    booking.status
                                                )}`}
                                            >
                                                {booking.status}
                                            </span>

                                        </td>

                                        <td>

                                            {booking.createdAt
                                                ? new Date(
                                                    booking.createdAt
                                                ).toLocaleDateString()
                                                : "-"}

                                        </td>

                                        <td>

                                            {booking.status === "Pending" ? (

                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() =>
                                                        handleComplete(
                                                            booking._id
                                                        )
                                                    }
                                                    disabled={
                                                        completingId ===
                                                        booking._id
                                                    }
                                                >

                                                    {completingId ===
                                                    booking._id
                                                        ? "Completing..."
                                                        : "Complete"}

                                                </button>

                                            ) : (

                                                <span className="text-muted">
                                                    Completed
                                                </span>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>
    );
}

export default FreelancerBookings;