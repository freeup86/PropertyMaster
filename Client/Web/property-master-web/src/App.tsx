import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';

// Auth Components
import ProtectedRoute from './components/Auth/ProtectedRoute'; 
import RoleBasedRoute from './components/RoleBasedRoute'; 
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';
import ResetPasswordForm from './components/Auth/ResetPasswordForm';
import Unauthorized from './pages/Unauthorized'; 

// Navigation and Pages
import NavigationBar from './components/NavigationBar';
import Dashboard from './pages/Dashboard';
import PropertiesList from './pages/PropertiesList';
import PropertyDetail from './pages/PropertyDetail';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import TenantDetail from './pages/TenantDetail';
import NotificationSettings from './components/settings/NotificationSettings';
import CreateAdminUserForm from './components/Auth/CreateAdminUserForm';
import { CalendarView } from './components/calendar/CalendarView';

// Maintenance Requests
import MaintenanceRequestList from './components/MaintenanceRequestList';
import CreateMaintenanceRequest from './components/CreateMaintenanceRequest';
import MaintenanceRequestDetails from './components/MaintenanceRequestDetails';

import AdminDashboard from './components/dashboards/AdminDashboard';
import OwnerDashboard from './components/dashboards/OwnerDashboard';
import DebugUserInfo from './pages/DebugUserInfo';
import React, { useEffect } from 'react';
import { authService } from './services/authService';
import UserPromotionForm from './components/Admin/UserPromotionForm';
import TaxReports from './pages/TaxReports';

const UserInfoDebug: React.FC = () => {
  useEffect(() => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    
    console.log('Debug - Token:', token);
    console.log('Debug - Current User:', user);
  }, []);

  return null;
};


const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavigationBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Default Protected Route */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Admin-Only Routes */}
            <Route element={<RoleBasedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin/settings" element={<NotificationSettings />} />
              <Route path="/admin/create-user" element={<CreateAdminUserForm />} />
              <Route path="/admin/promote-user" element={<UserPromotionForm />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={['Owner', 'Admin']} />}>
              <Route path="/properties" element={<PropertiesList />} />
              <Route path="/properties/new" element={<AddProperty />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/properties/:id/edit" element={<EditProperty />} />
              <Route path="/tax-reports" element={<TaxReports />} />
            </Route>

            {/* Property Manager, Owner, and Admin Routes */}
            <Route element={<RoleBasedRoute allowedRoles={['PropertyManager', 'Owner', 'Admin', 'Tenant']} />}>
              <Route path="/maintenance-requests" element={<MaintenanceRequestList />} />
              <Route path="/maintenance-requests/create" element={<CreateMaintenanceRequest />} />
              <Route path="/maintenance-requests/:id" element={<MaintenanceRequestDetails />} />
              <Route path="/calendar" element={<CalendarView />} />
            </Route>

            {/* Tenant and Higher Role Routes */}
            <Route element={<RoleBasedRoute allowedRoles={['Tenant', 'PropertyManager', 'Owner', 'Admin']} />}>
              <Route path="/tenants/:id" element={<TenantDetail />} />
            </Route>

            {/* Debug Route */}
            <Route path="/debug" element={<DebugUserInfo />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;