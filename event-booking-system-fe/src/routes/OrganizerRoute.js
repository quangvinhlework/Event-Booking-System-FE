import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const OrganizerRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'organizer') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default OrganizerRoute;