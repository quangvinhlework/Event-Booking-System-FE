import { Navigate } from "react-router-dom";
import { LoadingState } from "../components";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="page-shell d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
        <LoadingState text="Đang tải..." />
      </div>
    );
  }

  if (user?.roleName === 'ROLE_ORGANIZER') {
    return <Navigate to="/organizer/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
