import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  Card, 
  CardContent, 
  CardActions, 
  Button 
} from '@mui/material';
import { 
  Home as PropertyIcon, 
  AttachMoney as IncomeIcon, 
  TrendingUp as PerformanceIcon 
} from '@mui/icons-material';

const OwnerDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Owner Dashboard
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 3 
      }}>
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mb: 2 
            }}>
              <PropertyIcon color="primary" fontSize="large" />
              <Typography variant="h6">
                Property Overview
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="textSecondary">
              Quick overview of your property portfolio.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 2 
            }}>
              <Typography variant="subtitle1">Total Properties:</Typography>
              <Typography variant="h6" color="primary">3</Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              View Properties
            </Button>
          </CardActions>
        </Card>

        <Card elevation={3}>
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mb: 2 
            }}>
              <IncomeIcon color="success" fontSize="large" />
              <Typography variant="h6">
                Financial Summary
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="textSecondary">
              Monthly income and expense tracking.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 2 
            }}>
              <Typography variant="subtitle1">Total Monthly Income:</Typography>
              <Typography variant="h6" color="success">$5,420</Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button size="small" color="success">
              Detailed Financials
            </Button>
          </CardActions>
        </Card>

        <Card elevation={3}>
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mb: 2 
            }}>
              <PerformanceIcon color="secondary" fontSize="large" />
              <Typography variant="h6">
                Performance Metrics
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="textSecondary">
              Insights into property performance and ROI.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 2 
            }}>
              <Typography variant="subtitle1">Average ROI:</Typography>
              <Typography variant="h6" color="secondary">7.5%</Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button size="small" color="secondary">
              Performance Details
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};

export default OwnerDashboard;