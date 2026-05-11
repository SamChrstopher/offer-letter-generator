import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import "../auth/ProtectedRoute.css"

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="route-loader-container">
                <div className="route-loader"></div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    return <>{children}</>;
};

export default ProtectedRoute;