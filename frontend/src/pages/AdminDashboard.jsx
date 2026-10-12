/*
Author: Bootstrap
Date Accessed: 11 October 2026
Link: https://getbootstrap.com/docs/5.3/content/tables/
Reason: Used to display users and bookings in striped, responsive Bootstrap tables.
*/
/*
Author: MDN Web Docs
Date Accessed: 11 October 2026
Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
Reason: Used Promise.all to load the stats, users and bookings at the same time.
*/

import { useEffect, useState } from "react";
import {
    getAdminStats,
    getAdminUsers,
    getAdminBookings,
    getAdminGigs,
    deactivateGig
} from "../services/api";

// colour for each booking status
const statusClass = (status) => {
    switch (status) {
        case "Completed":
            return "bg-success";
        case "Pending":
            return "bg-warning text-dark";
        case "Cancelled":
            return "bg-danger";
        default:
            return "bg-secondary";
    }
};

// colour for each user role
const roleClass = (role) => {
    switch (role) {
        case "admin":
            return "bg-danger";
        case "freelancer":
            return "bg-info text-dark";
        default:
            return "bg-secondary";
    }
};

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [gigs, setGigs] = useState([]);
    const [deactivatingId, setDeactivatingId] = useState(null);
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // which table is showing, and the booking status filter
    const [activeTab, setActiveTab] = useState("users");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        const load = async () => {
            try {
                const [statsData, usersData, bookingsData, gigsData] = await Promise.all([
                    getAdminStats(),
                    getAdminUsers(),
                    getAdminBookings(),
                    getAdminGigs()
                ]);
                setStats(statsData.stats);
                setUsers(usersData.users);
                setBookings(bookingsData.bookings);
                setGigs(gigsData.gigs);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    // cards with a "tab" can be clicked to show that table
    const cards = [
        { label: "Users", value: stats.users, tab: "users" },
        { label: "Bookings", value: stats.bookings, tab: "bookings" },
        { label: "Gigs", value: stats.gigs, tab: "gigs" },
        { label: "Transactions", value: stats.transactions },
        { label: "Completed value", value: `R ${stats.completedValue.toFixed(2)}` }
    ];

    const countFor = (status) =>
        status === "All"
            ? bookings.length
            : bookings.filter((b) => b.status === status).length;

    const visibleBookings =
        statusFilter === "All"
            ? bookings
            : bookings.filter((b) => b.status === statusFilter);
    
    const handleDeactivateGig = async (gig) => {
        const confirmed = window.confirm(
            `Are you sure you want to deactivate "${gig.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeactivatingId(gig._id);
            setError("");
            setSuccess("");

            const data = await deactivateGig(gig._id);

            setGigs((currentGigs) =>
                currentGigs.map((currentGig) =>
                    currentGig._id === gig._id
                        ? data.gig
                        : currentGig
                )
            );

            setSuccess("Gig deactivated successfully.");
        } catch (err) {
            setError(
                err.message || "Unable to deactivate gig."
            );
        } finally {
            setDeactivatingId(null);
        }
    };

    return (
        <div className="container py-5">
            <h1 className="mb-4">Admin Dashboard</h1>

            <div className="row g-3 mb-5">
                {cards.map((card) => {
                    const clickable = Boolean(card.tab);
                    const active = clickable && activeTab === card.tab;

                    const body = (
                        <div className="card-body">
                            <div className="text-muted small">{card.label}</div>
                            <div className="fs-4 fw-bold">{card.value}</div>
                            {clickable && (
                                <div className="small text-primary">
                                    Click to view
                                </div>
                            )}
                        </div>
                    );

                    return (
                        <div className="col-6 col-md" key={card.label}>
                            {clickable ? (
                                <button
                                    type="button"
                                    className={`card shadow-sm text-center w-100 ${
                                        active ? "border-primary border-2" : ""
                                    }`}
                                    onClick={() => setActiveTab(card.tab)}
                                >
                                    {body}
                                </button>
                            ) : (
                                <div className="card shadow-sm text-center">
                                    {body}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {activeTab === "users" && (
                <>
                    <h3>Users</h3>
                    <div className="table-responsive mb-5">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`badge ${roleClass(u.role)}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {activeTab === "bookings" && (
                <>
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                        <h3 className="mb-0">All bookings</h3>

                        <div className="btn-group" role="group" aria-label="Filter bookings by status">
                            {["All", "Pending", "Completed"].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    className={`btn btn-sm ${
                                        statusFilter === status
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                    }`}
                                    onClick={() => setStatusFilter(status)}
                                >
                                    {status} ({countFor(status)})
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Gig</th>
                                    <th>Client</th>
                                    <th>Freelancer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted py-4">
                                            No bookings to show.
                                        </td>
                                    </tr>
                                ) : (
                                    visibleBookings.map((b) => (
                                        <tr key={b._id}>
                                            <td>{b.gig?.title}</td>
                                            <td>{b.client?.name}</td>
                                            <td>{b.freelancer?.name}</td>
                                            <td>R {Number(b.amount).toFixed(2)}</td>
                                            <td>
                                                <span className={`badge ${statusClass(b.status)}`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {activeTab === "gigs" && (
            <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="mb-0">Gig Moderation</h3>

                    <span className="text-muted">
                        {gigs.length} gigs
                    </span>
                </div>

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                <div className="table-responsive">
                    <table className="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th>Gig</th>
                                <th>Freelancer</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {gigs.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center text-muted py-4"
                                    >
                                        No gigs to show.
                                    </td>
                                </tr>
                            ) : (
                                gigs.map((gig) => (
                                    <tr key={gig._id}>
                                        <td>{gig.title}</td>

                                        <td>
                                            <div>{gig.freelancer?.name}</div>
                                            <small className="text-muted">
                                                {gig.freelancer?.email}
                                            </small>
                                        </td>

                                        <td>{gig.category}</td>

                                        <td>
                                            R {Number(gig.price).toFixed(2)}
                                        </td>

                                        <td>
                                            {gig.isActive ? (
                                                <span className="badge bg-success">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="badge bg-secondary">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>

                                        <td>
                                            {gig.isActive ? (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    disabled={
                                                        deactivatingId === gig._id
                                                    }
                                                    onClick={() =>
                                                        handleDeactivateGig(gig)
                                                    }
                                                >
                                                    {deactivatingId === gig._id
                                                        ? "Deactivating..."
                                                        : "Deactivate"}
                                                </button>
                                            ) : (
                                                <span className="text-muted">
                                                    Deactivated
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </>
        )}
        </div>
    );
}

export default AdminDashboard;