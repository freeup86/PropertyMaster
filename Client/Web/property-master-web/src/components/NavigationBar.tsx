// src/components/NavigationBar.tsx
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// Import authService and the UserInfo type
import { authService, UserInfo } from '../services/authService'; // Adjust path if needed

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  // State to track if user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // State to hold user info if logged in
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

  // Check authentication status when the component mounts
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      setIsAuthenticated(true);
      setCurrentUser(authService.getCurrentUser());
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
    // No dependencies needed if we only check on mount
    // If you need this to update dynamically without refresh (e.g., after login),
    // you might need a global state/context.
  }, []);

  // Handle logout action
  const handleLogout = () => {
    authService.logout(); // Clear token from storage
    setIsAuthenticated(false); // Update state
    setCurrentUser(null); // Update state
    navigate('/login'); // Redirect to login page
    // Optionally force a reload if state isn't updating everywhere:
    // window.location.reload();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* Link title back to dashboard if desired */}
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
             Property Master
          </RouterLink>
        </Typography>

        {/* Conditionally render navigation items */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? (
            // --- Show if user IS logged in ---
            <>
              {/* Keep existing links for logged-in users */}
              <Button color="inherit" component={RouterLink} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={RouterLink} to="/properties">
                Properties
              </Button>
              {/* Add other links for logged-in users */}

              {/* Display Welcome message */}
              {currentUser && (
                <Typography sx={{ mx: 2 }}> {/* Add some margin */}
                   Welcome, {currentUser.firstName}!
                </Typography>
              )}

              {/* Logout Button */}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            // --- Show if user IS NOT logged in ---
            <>
              {/* Login Button */}
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              {/* Register Button */}
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;