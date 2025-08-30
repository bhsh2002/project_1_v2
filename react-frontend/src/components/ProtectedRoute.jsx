import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <p>جار التحميل...</p>;

    if (!user) {
        const loginPath = requiredRole === 'MARKET_OWNER' ? '/market-owner/login' : '/admin/login';
        return <Navigate to={loginPath} replace />;
    }

    // if (requiredRole && !user.roles?.includes(requiredRole)) {
    //     // Optional: Redirect to a generic unauthorized page or home
    //     return <Navigate to="/" replace />;
    // }

    return children;
}
