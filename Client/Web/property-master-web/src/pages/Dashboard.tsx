import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Main chart area */}
        <Box sx={{ 
          flex: '1 1 auto', 
          minWidth: { xs: '100%', md: '66%', lg: '75%' }
        }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6">Portfolio Performance</Typography>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="body1">
                Portfolio performance chart will be displayed here.
              </Typography>
            </Box>
          </Paper>
        </Box>
        
        {/* Summary box */}
        <Box sx={{ 
          flex: '1 1 auto', 
          minWidth: { xs: '100%', md: '30%', lg: '22%' } 
        }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6">Portfolio Summary</Typography>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2">Total Properties: 0</Typography>
              <Typography variant="body2">Total Units: 0</Typography>
              <Typography variant="body2">Total Value: $0</Typography>
            </Box>
          </Paper>
        </Box>
        
        {/* Transactions section - full width */}
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <Typography variant="body1">
              No recent transactions to display.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;