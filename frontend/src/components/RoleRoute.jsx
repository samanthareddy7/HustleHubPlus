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