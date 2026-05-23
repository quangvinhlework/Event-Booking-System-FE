import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const OrganizerRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="lux-page d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
        <span style={{ color: 'rgba(244, 239, 230, 0.55)' }}>Đang tải...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ORGANIZER') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default OrganizerRoute;