import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService'; // Adjust path if needed

const ProtectedRoute: React.FC = () => {
  const location = useLocation();

  // Check if the authentication token exists using the authService
  const isAuthenticated = !!authService.getToken();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    console.log('ProtectedRoute: User not authenticated, redirecting to login.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Add a log to check user role
  console.log('Current User Role:', currentUser?.role);

  // If authenticated, render the child route element
  return <Outlet />;
};

export default ProtectedRoute;