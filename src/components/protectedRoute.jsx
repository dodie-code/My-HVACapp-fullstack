import React from "react";
import { Navigate } from "react-router-dom";
import { useMy } from "../context/MyContext";

function ProtectedRoute({ children, roles }) {
    const { user } = useMy();

    if (!user) return <Navigate to="/login" replace />;

    if (roles && !roles.includes(user.role)) {
        if (user.role === 'administrator') return <Navigate to="AdministratorDashboard" replace />;
        if (user.role === 'technician') return <Navigate to="/technician" replace />;
        if (user.role === 'client') return <Navigate to="/clientDashboard" replace />;
    }

    return children;
}

export default ProtectedRoute;