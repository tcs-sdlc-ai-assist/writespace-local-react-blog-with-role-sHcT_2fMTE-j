import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth.js';

export function ProtectedRoute({ children, adminOnly }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/blogs" replace />;
  }

  return children;
}