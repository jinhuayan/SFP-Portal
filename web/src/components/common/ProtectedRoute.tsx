import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles = [] }) => {
  const { currentUser, isLoadingSession } = useContext(AuthContext);
  const location = useLocation();

  // Show loading spinner while checking session
  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-[#4C51A4] mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

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