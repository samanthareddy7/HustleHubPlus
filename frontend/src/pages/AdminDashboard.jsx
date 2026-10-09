import { useEffect, useState } from "react";
import {
    getAdminStats,
    getAdminUsers,
    getAdminBookings
} from "../services/api";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const [statsData, usersData, bookingsData] = await Promise.all([
                    getAdminStats(),
                    getAdminUsers(),
                    getAdminBookings()
                ]);
                setStats(statsData.stats);
                setUsers(usersData.users);
                setBookings(bookingsData.bookings);
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

    const cards = [
        { label: "Users", value: stats.users },
        { label: "Gigs", value: stats.gigs },
        { label: "Bookings", value: stats.bookings },
        { label: "Transactions", value: stats.transactions },
        { label: "Completed value", value: `R ${stats.completedValue.toFixed(2)}` }
    ];

    return (
        <div className="container py-5">
            <h1 className="mb-4">Admin Dashboard</h1>

            <div className="row g-3 mb-5">
                {cards.map((card) => (
                    <div className="col-6 col-md" key={card.label}>
                        <div className="card shadow-sm text-center">
                            <div className="card-body">
                                <div className="text-muted small">{card.label}</div>
                                <div className="fs-4 fw-bold">{card.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

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
                                    <span className="badge bg-secondary">{u.role}</span>
                                </td>
                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h3>All bookings</h3>
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
                        {bookings.map((b) => (
                            <tr key={b._id}>
                                <td>{b.gig?.title}</td>
                                <td>{b.client?.name}</td>
                                <td>{b.freelancer?.name}</td>
                                <td>R {Number(b.amount).toFixed(2)}</td>
                                <td>
                                    <span className="badge bg-info">{b.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;