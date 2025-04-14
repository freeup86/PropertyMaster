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
  Group as UserIcon, 
  Settings as SettingsIcon, 
  Assessment as ReportIcon 
} from '@mui/icons-material';

const AdminDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
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
              <UserIcon color="primary" fontSize="large" />
              <Typography variant="h6">
                User Management
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="textSecondary">
              Manage user accounts, roles, and access permissions.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              Manage Users
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
              <SettingsIcon color="secondary" fontSize="large" />
              <Typography variant="h6">
                System Settings
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="textSecondary">
              Configure system-wide settings and global configurations.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="secondary">
              System Configuration
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
              <ReportIcon color="error" fontSize="large" />
              <Typography variant="h6">
                Reporting
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="textSecondary">
              Generate and view comprehensive system reports.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="error">
              View Reports
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};

export default AdminDashboard;