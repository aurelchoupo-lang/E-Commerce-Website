import { Navigate } from 'react-router-dom';
import { isLoggedIn, getCurrentUserObj } from '../services/api';

function ProtectedRoute({ children, adminOnly = false }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    const user = getCurrentUserObj();
    if (!user || user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
