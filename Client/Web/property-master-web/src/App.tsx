import React from 'react';
// Make sure BrowserRouter is imported as Router if you prefer that alias, or just use BrowserRouter
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';
import ResetPasswordForm from './components/Auth/ResetPasswordForm'; 

// Your existing components/pages
import NavigationBar from './components/NavigationBar';
import Dashboard from './pages/Dashboard';
import PropertiesList from './pages/PropertiesList';
import PropertyDetail from './pages/PropertyDetail';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import TenantDetail from './pages/TenantDetail';

// --- Add Imports for Auth Components ---
import ProtectedRoute from './components/Auth/ProtectedRoute'; // Adjust path if needed
import LoginForm from './components/Auth/LoginForm';       // Adjust path if needed
import RegisterForm from './components/Auth/RegisterForm'; // Adjust path if needed
// Optional: Add a public HomePage component if '/' shouldn't always be Dashboard
// import HomePage from './pages/HomePage';

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
              <Route path="/dashboard" element={<Dashboard />} /> {/* Explicit dashboard route */}
              <Route path="/properties" element={<PropertiesList />} />
              <Route path="/properties/new" element={<AddProperty />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/properties/:id/edit" element={<EditProperty />} />
              <Route path="/tenants/:id" element={<TenantDetail />} />
              {/* Add any other protected routes here (e.g., /reports, /settings) */}
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