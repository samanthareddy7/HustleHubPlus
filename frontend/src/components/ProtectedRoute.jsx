/*
Author: Robin Wieruch
Date Accessed: 11 October 2026
Link: https://www.robinwieruch.de/react-router-private-routes/
Reason: Used to create a protected route that redirects users without a token to the login page.
*/

import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    const token = sessionStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;