import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService'; // Adjust path if needed

const ProtectedRoute: React.FC = () => {
  const location = useLocation(); // Get current location

  // Check if the authentication token exists using the authService
  const isAuthenticated = !!authService.getToken();

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    // Pass the current location state so we can redirect back after login (optional)
    console.log('ProtectedRoute: User not authenticated, redirecting to login.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child route element using <Outlet />
  // <Outlet /> is a placeholder provided by react-router-dom v6+
  // for rendering nested routes.
  return <Outlet />;
};

export default ProtectedRoute;