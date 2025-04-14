import React, { useState, useEffect, useRef } from 'react';
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
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Link as RouterLink, 
  useNavigate 
} from 'react-router-dom';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { authService, UserInfo } from '../services/authService';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const maintenanceButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      setIsAuthenticated(true);
      setCurrentUser(authService.getCurrentUser());
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  }, []);

  const handleMouseEnter = () => {
    if (maintenanceButtonRef.current) {
      setAnchorEl(maintenanceButtonRef.current);
    }
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setAnchorEl(null);
    }, 200);
  };

  const handleMenuMouseEnter = () => {
    // Prevent the menu from closing
    if (anchorEl) {
      clearTimeout(window as any);
    }
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/login');
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
              <Button color="inherit" component={RouterLink} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={RouterLink} to="/properties">
                Properties
              </Button>
              <Button color="inherit" component={RouterLink} to="/calendar">
                Calendar
              </Button>
              {/* Maintenance Dropdown */}
              <div 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ position: 'relative' }}
              >
                <Button 
                  ref={maintenanceButtonRef}
                  color="inherit"
                  aria-haspopup="true"
                  aria-expanded={Boolean(anchorEl)}
                >
                  Maintenance
                </Button>
                <Popper
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  placement="bottom-start"
                  sx={{ 
                    zIndex: (theme) => theme.zIndex.modal,
                    marginTop: '8px' // Slight spacing from the button
                  }}
                >
                  <Paper 
                    onMouseEnter={handleMenuMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                      <MenuList>
                        <MenuItem 
                          onClick={() => handleMenuItemClick('/maintenance-requests')}
                        >
                          View Requests
                        </MenuItem>
                        <MenuItem 
                          onClick={() => handleMenuItemClick('/maintenance-requests/create')}
                        >
                          Create Request
                        </MenuItem>
                        <MenuItem component={RouterLink} to="/settings/notifications">
                          <ListItemIcon>
                              <NotificationsIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Notification Settings</ListItemText>
                      </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Popper>
              </div>

              {currentUser && (
                <Typography sx={{ mx: 2 }}>
                  Welcome, {currentUser.firstName}!
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