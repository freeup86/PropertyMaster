import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { authService } from '../services/authService';

const DebugUserInfo: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const token = authService.getToken();

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6">User Debug Information</Typography>
      <Box>
        <Typography>Current User: {JSON.stringify(currentUser, null, 2)}</Typography>
        <Typography>Token Present: {token ? 'Yes' : 'No'}</Typography>
      </Box>
    </Paper>
  );
};

export default DebugUserInfo;