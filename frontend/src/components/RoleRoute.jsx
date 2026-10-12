/*
Author: Mohammad Yousof
Date Accessed: 11 October 2026
Link: https://dev.to/m_yousaf/implementing-role-based-access-control-in-react-18-with-react-router-v6-a-step-by-step-guide-1p8b
Reason: Used to restrict routes to a specific user role and redirect users with the wrong role.
*/

import { Navigate } from "react-router-dom";
import { getSavedUser, getToken } from "../services/api";

function RoleRoute({ children, allowedRole }) {
    const token = getToken();
    const user = getSavedUser();

    // Not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in, but wrong role
    if (user.role !== allowedRole) {
        return <Navigate to="/dashboard" replace />;
    }

    // Correct role
    return children;
}

export default RoleRoute;