import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getGigs,
    getMyGigs,
    getMyBookings,
    getFreelancerBookings,
    getFreelancerIncome
} from "../services/api";


function Dashboard() {

    const savedUser = sessionStorage.getItem("user");

    let user = null;

    try {
        user = savedUser ? JSON.parse(savedUser) : null;
    } catch {
        user = null;
    }


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // Client data
    const [gigs, setGigs] = useState([]);
    const [clientBookings, setClientBookings] = useState([]);


    // Freelancer data
    const [myGigs, setMyGigs] = useState([]);
    const [freelancerBookings, setFreelancerBookings] = useState([]);
    const [income, setIncome] = useState(null);


    useEffect(() => {

        const loadDashboard = async () => {

            setLoading(true);
            setError("");

            try {

                if (user?.role === "client") {

                    const [gigsData, bookingsData] =
                        await Promise.all([
                            getGigs(),
                            getMyBookings()
                        ]);

                    setGigs(
                        Array.isArray(gigsData)
                            ? gigsData
                            : gigsData.gigs || []
                    );

                    setClientBookings(
                        Array.isArray(bookingsData)
                            ? bookingsData
                            : bookingsData.bookings || []
                    );
                }


                if (user?.role === "freelancer") {

                    const [
                        myGigsData,
                        bookingsData,
                        incomeData
                    ] = await Promise.all([
                        getMyGigs(),
                        getFreelancerBookings(),
                        getFreelancerIncome()
                    ]);


                    setMyGigs(
                        Array.isArray(myGigsData)
                            ? myGigsData
                            : myGigsData.gigs || []
                    );


                    setFreelancerBookings(
                        Array.isArray(bookingsData)
                            ? bookingsData
                            : bookingsData.bookings || []
                    );


                    setIncome(incomeData);
                }

            } catch (error) {

                console.error(error);

                setError(
                    error.message ||
                    "Unable to load dashboard data."
                );

            } finally {

                setLoading(false);

            }
        };


        if (user) {
            loadDashboard();
        } else {
            setLoading(false);
        }

    }, [user?.role]);


    if (!user) {

        return (
            <div className="container py-5">

                <div className="alert alert-danger">
                    Unable to load your account information.
                </div>

            </div>
        );
    }

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

                    <p className="mt-3 text-muted">
                        Loading your dashboard...
                    </p>

                </div>

            </div>
        );
    }

    if (error) {

        return (
            <div className="container py-5">

                <div className="alert alert-danger">
                    {error}
                </div>

            </div>
        );
    }

//client
    if (user.role === "client") {

        const pendingBookings =
            clientBookings.filter(
                booking => booking.status === "Pending"
            ).length;

        const completedBookings =
            clientBookings.filter(
                booking => booking.status === "Completed"
            ).length;


        return (
            <div className="container py-5">

            

                <div className="mb-5">

                    <h1 className="fw-bold">
                        Welcome, {user.name}
                    </h1>

                    <p className="text-muted">
                        Find freelance services and manage your bookings.
                    </p>

                </div>


  

                <div className="row g-4 mb-5">

                    <div className="col-md-4">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Available Gigs
                                </h6>

                                <h2 className="fw-bold">
                                    {gigs.length}
                                </h2>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-4">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Pending Bookings
                                </h6>

                                <h2 className="fw-bold">
                                    {pendingBookings}
                                </h2>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-4">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Completed Bookings
                                </h6>

                                <h2 className="fw-bold">
                                    {completedBookings}
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>




                <div className="d-flex gap-2 mb-4">

                    <Link
                        to="/gigs"
                        className="btn btn-primary"
                    >
                        Browse Gigs
                    </Link>

                    <Link
                        to="/client-bookings"
                        className="btn btn-outline-primary"
                    >
                        My Bookings
                    </Link>

                </div>


            

                <div className="card border-0 shadow-sm">

                    <div className="card-body">

                        <h4 className="mb-4">
                            Recent Bookings
                        </h4>

                        {clientBookings.length === 0 ? (

                            <p className="text-muted">
                                You haven't made any bookings yet.
                            </p>

                        ) : (

                            <div className="table-responsive">

                                <table className="table align-middle">

                                    <thead>

                                        <tr>
                                            <th>Service</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {clientBookings
                                            .slice(0, 5)
                                            .map((booking) => (

                                                <tr key={booking._id}>

                                                    <td>
                                                        {booking.gig?.title ||
                                                            "Gig"}
                                                    </td>

                                                    <td>
                                                        R
                                                        {Number(
                                                            booking.amount || 0
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`badge ${
                                                                booking.status ===
                                                                "Completed"
                                                                    ? "bg-success"
                                                                    : "bg-warning text-dark"
                                                            }`}
                                                        >
                                                            {booking.status}
                                                        </span>

                                                    </td>

                                                </tr>

                                            ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>
        );
    }
//freelancer

    if (user.role === "freelancer") {

        const pendingBookings =
            freelancerBookings.filter(
                booking => booking.status === "Pending"
            ).length;


        const completedBookings =
            freelancerBookings.filter(
                booking => booking.status === "Completed"
            ).length;


        const summary = income?.summary || {};

        const totalIncome =
            Number(summary.totalIncome || 0);

        const estimatedTax =
            Number(summary.estimatedTax || 0);

        const netIncome =
            Number(summary.netIncome || 0);


        return (
            <div className="container py-5">

                {/* Header */}

                <div className="mb-5">

                    <h1 className="fw-bold">
                        Welcome, {user.name}
                    </h1>

                    <p className="text-muted">
                        Manage your freelance business from one place.
                    </p>

                </div>


                {/* Statistics */}

                <div className="row g-4 mb-5">

                    <div className="col-md-4 col-lg-2">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    My Gigs
                                </h6>

                                <h2 className="fw-bold">
                                    {myGigs.length}
                                </h2>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-4 col-lg-2">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Bookings
                                </h6>

                                <h2 className="fw-bold">
                                    {freelancerBookings.length}
                                </h2>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-4 col-lg-2">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Pending
                                </h6>

                                <h2 className="fw-bold">
                                    {pendingBookings}
                                </h2>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-4 col-lg-2">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Completed
                                </h6>

                                <h2 className="fw-bold">
                                    {completedBookings}
                                </h2>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-4 col-lg-2">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Income
                                </h6>

                                <h2 className="fw-bold">
                                    R{netIncome.toFixed(2)}
                                </h2>

                            </div>

                        </div>

                    </div>


                    <div className="col-md-4 col-lg-2">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Est. Tax
                                </h6>

                                <h2 className="fw-bold">
                                    R{estimatedTax.toFixed(2)}
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>


               

                <div className="d-flex flex-wrap gap-2 mb-4">

                    <Link
                        to="/create-gig"
                        className="btn btn-primary"
                    >
                        Create New Gig
                    </Link>

                    <Link
                        to="/my-gigs"
                        className="btn btn-outline-primary"
                    >
                        Manage My Gigs
                    </Link>

                    <Link
                        to="/freelancer-bookings"
                        className="btn btn-outline-primary"
                    >
                        View Bookings
                    </Link>

                </div>


               

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-body">

                        <h4 className="mb-4">
                            Income Summary
                        </h4>

                        <div className="row">

                            <div className="col-md-4">

                                <p className="text-muted mb-1">
                                    Total Booking Value
                                </p>

                                <h3>
                                    R{totalIncome.toFixed(2)}
                                </h3>

                            </div>


                            <div className="col-md-4">

                                <p className="text-muted mb-1">
                                    Estimated Tax
                                </p>

                                <h3>
                                    R{estimatedTax.toFixed(2)}
                                </h3>

                            </div>


                            <div className="col-md-4">

                                <p className="text-muted mb-1">
                                    Net Income
                                </p>

                                <h3>
                                    R{netIncome.toFixed(2)}
                                </h3>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="card border-0 shadow-sm">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <h4 className="mb-0">
                                My Recent Gigs
                            </h4>

                            <Link
                                to="/my-gigs"
                                className="btn btn-sm btn-outline-primary"
                            >
                                View All
                            </Link>

                        </div>


                        {myGigs.length === 0 ? (

                            <div className="text-center py-4">

                                <p className="text-muted">
                                    You haven't created any gigs yet.
                                </p>

                                <Link
                                    to="/create-gig"
                                    className="btn btn-primary"
                                >
                                    Create Your First Gig
                                </Link>

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table align-middle">

                                    <thead>

                                        <tr>
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {myGigs
                                            .slice(0, 5)
                                            .map((gig) => (

                                                <tr key={gig._id}>

                                                    <td>
                                                        {gig.title}
                                                    </td>

                                                    <td>
                                                        {gig.category}
                                                    </td>

                                                    <td>
                                                        R
                                                        {Number(
                                                            gig.price || 0
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`badge ${
                                                                gig.isActive
                                                                    ? "bg-success"
                                                                    : "bg-secondary"
                                                            }`}
                                                        >
                                                            {gig.isActive
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>

                                                    </td>

                                                </tr>

                                            ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="container py-5">

            <div className="alert alert-warning">
                Your account does not have a recognised role.
            </div>

        </div>
    );
}

export default Dashboard;

