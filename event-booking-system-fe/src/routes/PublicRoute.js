import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (user?.role === 'organizer') {
    return <Navigate to="/organizer/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;