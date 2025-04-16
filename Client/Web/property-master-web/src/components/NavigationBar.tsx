import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Popper, 
  Paper, 
  ClickAwayListener,
  MenuList,
  MenuItem
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authService, UserInfo } from '../services/authService';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      setIsAuthenticated(true);
      const currentUser = authService.getCurrentUser();
      console.log('Current User Role:', currentUser?.role);
      setCurrentUser(currentUser);
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/login');
  };

  // Render menu items based on user role
  const renderMenuItems = () => {
    if (!currentUser) return null;
    console.log('Rendering menu for role:', currentUser.role);

    switch (currentUser.role) {
      case 'Admin':
        return (
          <>
          <Button color="inherit" component={RouterLink} to="/admin/create-user">
            Create Admin User
          </Button>
          <Button color="inherit" component={RouterLink} to="/admin/promote-user">
            Promote User
          </Button>
          <Button color="inherit" component={RouterLink} to="/admin/settings">
            Admin Settings
          </Button>
          </>
        );
      case 'Owner':
        return (
          <>
            <Button color="inherit" component={RouterLink} to="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={RouterLink} to="/properties">
              My Properties
            </Button>
            <Button color="inherit" component={RouterLink} to="/properties/new">
              Add Property
            </Button>
          </>
        );
      case 'PropertyManager':
        return (
          <>
            <Button color="inherit" component={RouterLink} to="/maintenance-requests">
              Maintenance Requests
            </Button>
            <Button color="inherit" component={RouterLink} to="/properties">
              Managed Properties
            </Button>
          </>
        );
      case 'Tenant':
        return (
          <>
            <Button color="inherit" component={RouterLink} to={`/tenants/${currentUser.userId}`}>
              My Tenant Profile
            </Button>
            <Button color="inherit" component={RouterLink} to="/maintenance-requests/create">
              Request Maintenance
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Property Master
          </RouterLink>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              {renderMenuItems()}
              {currentUser && (
                <Typography sx={{ mx: 2 }}>
                  Welcome, {currentUser.firstName} ({currentUser.role})!
                </Typography>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
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