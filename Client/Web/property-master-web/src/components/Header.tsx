import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Property Master
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/properties">
            Properties
          </Button>
          <Button color="inherit" component={RouterLink} to="/analysis">
            Financial Analysis
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;