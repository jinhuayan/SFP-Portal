import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles = [] }) => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  // If user is not authenticated, redirect to login
  if (!currentUser || !currentUser.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If required roles are specified and user doesn't have any of them, redirect to dashboard
  if (requiredRoles.length > 0 && !requiredRoles.some(role => currentUser.role.includes(role))) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has required roles, render the children
  return <>{children}</>;
};

export default ProtectedRoute;