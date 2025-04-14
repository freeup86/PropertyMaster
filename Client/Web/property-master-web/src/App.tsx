import React from 'react';
 import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import Link
 import { CssBaseline, Box, Button } from '@mui/material'; // Import Button if needed
 import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';
 import ResetPasswordForm from './components/Auth/ResetPasswordForm';
 
 import NavigationBar from './components/NavigationBar';
 import PropertiesList from './pages/PropertiesList';
 import PropertyDetail from './pages/PropertyDetail';
 import AddProperty from './pages/AddProperty';
 import EditProperty from './pages/EditProperty';
 import TenantDetail from './pages/TenantDetail';
 import FinancialDashboard from './components/dashboards/FinancialDashboard';
 import Dashboard from './pages/Dashboard';
 
 // --- Imports for Auth Components ---
 import ProtectedRoute from './components/Auth/ProtectedRoute';
 import LoginForm from './components/Auth/LoginForm';
 import RegisterForm from './components/Auth/RegisterForm';
 import { CalendarView } from './components/calendar/CalendarView';
 
 // --- Import Maintenance Request Components ---
 import MaintenanceRequestList from './components/MaintenanceRequestList'; // Adjust path
 import CreateMaintenanceRequest from './components/CreateMaintenanceRequest'; // Adjust path
 import MaintenanceRequestDetails from './components/MaintenanceRequestDetails'; // Adjust path
import NotificationSettings from './components/settings/NotificationSettings';
 

 const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* NavigationBar might need updates later to show Login/Logout */}
        <NavigationBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            {/* --- Public Routes --- */}
            {/* Optional: Replace Dashboard with a public HomePage if needed */}
            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            {/* --- Add Password Reset Routes --- */}
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            {/* --- End Password Reset Routes --- */}
 

            {/* --- Protected Routes --- */}
            {/* Wrap all protected routes inside the ProtectedRoute element */}
            <Route element={<ProtectedRoute />}>
              {/* Your existing routes are now protected */}
              {/* Consider if '/' should truly be protected or redirect */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<FinancialDashboard />} />
              <Route path="/properties" element={<PropertiesList />} />
              <Route path="/properties/new" element={<AddProperty />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/properties/:id/edit" element={<EditProperty />} />
              <Route path="/tenants/:id" element={<TenantDetail />} />
              <Route path="/settings/notifications" element={<NotificationSettings/>} />
 
              {/* --- Maintenance Request Routes --- */}
              <Route path="/maintenance-requests" element={<MaintenanceRequestList />} />
              <Route path="/maintenance-requests/create" element={<CreateMaintenanceRequest />} />
              <Route path="/maintenance-requests/:id" element={<MaintenanceRequestDetails />} />
              <Route path="/calendar" element={<CalendarView />} />
            </Route>
 

            {/* Optional: Add a 404 Not Found route */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
 

          </Routes>
        </Box>
      </Box>
    </Router>
  );
 };
 

 export default App;