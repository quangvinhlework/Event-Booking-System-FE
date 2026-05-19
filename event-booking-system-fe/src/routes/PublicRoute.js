import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user?.role === 'ORGANIZER') {
    return <Navigate to="/organizer/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
