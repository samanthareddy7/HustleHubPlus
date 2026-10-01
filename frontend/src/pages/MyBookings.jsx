import { useEffect, useState } from "react";
import { getMyBookings } from "../services/api";

function MyBookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyBookings();

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
                    Loading your bookings...
                </p>

            </div>
        );
    }

    return (
        <div className="container py-5">

            <div className="mb-4">
                <h1 className="fw-bold">
                    My Bookings
                </h1>

                <p className="text-muted">
                    View the services you have booked.
                </p>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {bookings.length === 0 ? (

                <div className="card shadow-sm">
                    <div className="card-body text-center py-5">

                        <h5>
                            You don't have any bookings yet.
                        </h5>

                        <p className="text-muted">
                            Browse available gigs to find a service.
                        </p>

                        <a
                            href="/gigs"
                            className="btn btn-primary"
                        >
                            Browse Gigs
                        </a>

                    </div>
                </div>

            ) : (

                <div className="card shadow-sm">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">
                                <tr>
                                    <th>Gig</th>
                                    <th>Category</th>
                                    <th>Freelancer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
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
                                                {booking.gig?.description}
                                            </small>
                                        </td>

                                        <td>
                                            {booking.gig?.category}
                                        </td>

                                        <td>
                                            {booking.freelancer?.name}
                                            <br />
                                            <small className="text-muted">
                                                {booking.freelancer?.email}
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

export default MyBookings;