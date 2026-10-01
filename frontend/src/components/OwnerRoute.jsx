import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getMyGigs, getToken, getSavedUser } from "../services/api";

function OwnerRoute({ children }) {

    const { id } = useParams();

    const [checking, setChecking] = useState(true);
    const [allowed, setAllowed] = useState(false);

    const token = getToken();
    const user = getSavedUser();

    useEffect(() => {

        const checkOwnership = async () => {

            try {

                // Must be logged in
                if (!token || !user) {
                    setAllowed(false);
                    return;
                }

                // Only freelancers can edit gigs
                if (user.role !== "freelancer") {
                    setAllowed(false);
                    return;
                }

                // Get only the current freelancer's gigs
                const data = await getMyGigs();

                const ownsGig = data.gigs.some(
                    (gig) => gig._id === id
                );

                setAllowed(ownsGig);

            } catch (error) {

                setAllowed(false);

            } finally {

                setChecking(false);
            }
        };

        checkOwnership();

    }, [id, token, user]);

    // While checking ownership
    if (checking) {

        return (
            <div className="container py-5 text-center">

                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                    <span className="visually-hidden">
                        Checking access...
                    </span>
                </div>

                <p className="mt-3">
                    Checking access...
                </p>

            </div>
        );
    }

    // Not allowed 
    if (!allowed) {
        return <Navigate to="/dashboard" replace />;
    }

    // Owner
    return children;
}

export default OwnerRoute;