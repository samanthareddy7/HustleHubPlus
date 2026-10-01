import { useEffect, useState } from "react";
import { getFreelancerIncome } from "../services/api";

function FreelancerIncome() {
    const [summary, setSummary] = useState({
        totalIncome: 0,
        estimatedTax: 0,
        netIncome: 0
    });

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadIncome();
    }, []);

    const loadIncome = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getFreelancerIncome();

            setSummary(
                data.summary || {
                    totalIncome: 0,
                    estimatedTax: 0,
                    netIncome: 0
                }
            );

            setTransactions(data.transactions || []);
        } catch (err) {
            console.error("Income loading error:", err);
            setError(err.message || "Could not load income information.");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return `R${Number(amount || 0).toFixed(2)}`;
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Completed":
                return "bg-success";

            case "Pending":
                return "bg-warning text-dark";

            default:
                return "bg-secondary";
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

                    <p className="mt-3 text-muted">
                        Loading income information...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">

            <div className="mb-4">
                <h1 className="fw-bold">
                    Freelancer Income
                </h1>

                <p className="text-muted">
                    Track your earnings, estimated tax and net income.
                </p>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <strong>Unable to load income:</strong>{" "}
                    {error}
                </div>
            )}

           
            <div className="row g-4 mb-5">

                
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted mb-2">
                                        Total Income
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {formatCurrency(
                                            summary.totalIncome
                                        )}
                                    </h2>
                                </div>
                            </div>

                            <small className="text-muted">
                                Income generated from bookings
                            </small>
                        </div>
                    </div>
                </div>

                
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted mb-2">
                                        Estimated Tax
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {formatCurrency(
                                            summary.estimatedTax
                                        )}
                                    </h2>
                                </div>

                                <div className="fs-2">
                                </div>
                            </div>

                            <small className="text-muted">
                                Estimated tax based on booking income
                            </small>
                        </div>
                    </div>
                </div>

               
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p className="text-muted mb-2">
                                        Net Income
                                    </p>

                                    <h2 className="fw-bold mb-0 text-success">
                                        {formatCurrency(
                                            summary.netIncome
                                        )}
                                    </h2>
                                </div>

                                <div className="fs-2">
                                    
                                </div>
                            </div>

                            <small className="text-muted">
                                Income after estimated tax
                            </small>
                        </div>
                    </div>
                </div>

            </div>

           
            <div className="card border-0 shadow-sm mb-5">
                <div className="card-body p-4">

                    <div className="mb-4">
                        <h4 className="fw-bold mb-1">
                            Income Breakdown
                        </h4>

                        <p className="text-muted mb-0">
                            Overview of your total income, estimated tax
                            and net income.
                        </p>
                    </div>

                    <div className="row text-center g-4">

                        
                        <div className="col-md-4">
                            <div className="p-4 rounded bg-light">
                                <div
                                    className="progress mb-3"
                                    style={{ height: "12px" }}
                                >
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{
                                            width:
                                                summary.totalIncome > 0
                                                    ? "100%"
                                                    : "0%"
                                        }}
                                    />
                                </div>

                                <h5 className="fw-bold">
                                    {formatCurrency(
                                        summary.totalIncome
                                    )}
                                </h5>

                                <small className="text-muted">
                                    Total income
                                </small>
                            </div>
                        </div>

                       
                        <div className="col-md-4">
                            <div className="p-4 rounded bg-light">
                                <div
                                    className="progress mb-3"
                                    style={{ height: "12px" }}
                                >
                                    <div
                                        className="progress-bar bg-warning"
                                        role="progressbar"
                                        style={{
                                            width:
                                                summary.totalIncome > 0
                                                    ? `${Math.min(
                                                        (summary.estimatedTax /
                                                            summary.totalIncome) *
                                                            100,
                                                        100
                                                    )}%`
                                                    : "0%"
                                        }}
                                    />
                                </div>

                                <h5 className="fw-bold">
                                    {formatCurrency(
                                        summary.estimatedTax
                                    )}
                                </h5>

                                <small className="text-muted">
                                    Estimated tax
                                </small>
                            </div>
                        </div>

                    
                        <div className="col-md-4">
                            <div className="p-4 rounded bg-light">
                                <div
                                    className="progress mb-3"
                                    style={{ height: "12px" }}
                                >
                                    <div
                                        className="progress-bar bg-success"
                                        role="progressbar"
                                        style={{
                                            width:
                                                summary.totalIncome > 0
                                                    ? `${Math.min(
                                                        (summary.netIncome /
                                                            summary.totalIncome) *
                                                            100,
                                                        100
                                                    )}%`
                                                    : "0%"
                                        }}
                                    />
                                </div>

                                <h5 className="fw-bold">
                                    {formatCurrency(
                                        summary.netIncome
                                    )}
                                </h5>

                                <small className="text-muted">
                                    Net income
                                </small>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            
            <div className="card border-0 shadow-sm">

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-1">
                                Transaction History
                            </h4>

                            <p className="text-muted mb-0">
                                Earnings generated from completed and
                                pending bookings.
                            </p>
                        </div>

                        <span className="badge bg-primary">
                            {transactions.length} Transactions
                        </span>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="display-5 mb-3">
                                
                            </div>

                            <h5>
                                No transactions yet
                            </h5>

                            <p className="text-muted">
                                Your booking income will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead>
                                    <tr>
                                        <th>Gig</th>
                                        <th>Amount</th>
                                        <th>Estimated Tax</th>
                                        <th>Freelancer Income</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr key={transaction._id}>

                                            <td>
                                                <strong>
                                                    {transaction.gig?.title ||
                                                        "Unknown Gig"}
                                                </strong>

                                                {transaction.gig?.category && (
                                                    <div>
                                                        <small className="text-muted">
                                                            {
                                                                transaction.gig
                                                                    .category
                                                            }
                                                        </small>
                                                    </div>
                                                )}
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    transaction.amount
                                                )}
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    transaction.taxEstimated
                                                )}
                                            </td>

                                            <td className="fw-bold text-success">
                                                {formatCurrency(
                                                    transaction.freelancerIncome
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getStatusClass(
                                                        transaction.status
                                                    )}`}
                                                >
                                                    {transaction.status}
                                                </span>
                                            </td>

                                            <td>
                                                {transaction.createdAt
                                                    ? new Date(
                                                        transaction.createdAt
                                                    ).toLocaleDateString()
                                                    : "N/A"}
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

export default FreelancerIncome;