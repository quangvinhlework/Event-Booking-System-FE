import { Navigate } from "react-router-dom";
import { LoadingState } from "../components";
import { useAuth } from "../hooks/useAuth";

const OrganizerRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-shell d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
        <LoadingState text="Đang tải..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.roleName !== 'ROLE_ORGANIZER') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default OrganizerRoute;