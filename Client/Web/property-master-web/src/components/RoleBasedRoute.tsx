import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

interface RoleBasedRouteProps {
  allowedRoles: string[];
  redirectPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  allowedRoles, 
  redirectPath = '/unauthorized' 
}) => {
  const currentUser = authService.getCurrentUser();

  // Log for debugging
  console.log('Current User:', currentUser);
  console.log('Allowed Roles:', allowedRoles);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const isAllowed = allowedRoles.includes(currentUser.role);

  console.log('Is Allowed:', isAllowed);

  return isAllowed ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default RoleBasedRoute;