import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Divider, 
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import tenantService, { Tenant, UpdateTenantRequest } from '../services/tenantService';
import TenantForm from '../components/TenantForm';

  const TenantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        if (id) {
          const data = await tenantService.getTenant(id);
          setTenant(data);
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to load tenant information. Please try again later.');
        setLoading(false);
      }
    };

    fetchTenant();
  }, [id]);

  const handleUpdate = async (values: UpdateTenantRequest) => {
    try {
      if (id) {
        await tenantService.updateTenant(id, values);
        const updatedTenant = await tenantService.getTenant(id);
        setTenant(updatedTenant);
        setEditDialogOpen(false);
      }
    } catch (err) {
      setError('Failed to update tenant. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      if (id && tenant) {
        await tenantService.deleteTenant(id);
        navigate(`/properties/${tenant.propertyId}`);
      }
    } catch (err) {
      setError('Failed to delete tenant. Please try again.');
    }
    setDeleteDialogOpen(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !tenant) {
    return (
      <Container>
        <Alert severity="error">{error || 'Tenant not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <Button 
          component={RouterLink} 
          to={`/properties/${tenant.propertyId}`}
          color="inherit"
          sx={{ mr: 2 }}
        >
          Back to Property
        </Button>
        <Typography variant="h4">{tenant.firstName} {tenant.lastName}</Typography>
      </Box>
      
      <Box display="flex" mb={3}>
        <Chip 
          icon={<PersonIcon />} 
          label="Tenant" 
          sx={{ mr: 1 }} 
        />
        <Chip label={`Unit ${tenant.unitNumber}`} />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ 
          flex: '1 1 auto', 
          minWidth: { xs: '100%', md: '65%' } 
        }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {tenant.email || 'Not specified'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Phone
                </Typography>
                <Typography variant="body1">
                  {tenant.phoneNumber || 'Not specified'}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Lease Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Property
                </Typography>
                <Typography variant="body1">
                  {tenant.propertyName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Unit
                </Typography>
                <Typography variant="body1">
                  Unit {tenant.unitNumber}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: '45%' } }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Lease Start Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(tenant.leaseStartDate)}
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: '45%' } }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Lease End Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(tenant.leaseEndDate)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ 
          flex: '1 1 auto', 
          minWidth: { xs: '100%', md: '30%' } 
        }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" flexDirection="column" gap={1}>
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<EditIcon />}
                onClick={() => setEditDialogOpen(true)}
                fullWidth
              >
                Edit Tenant
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                fullWidth
              >
                Delete Tenant
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit Tenant
        </DialogTitle>
        <DialogContent>
          {error && (
            <Box mb={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          <TenantForm 
            initialValues={tenant}
            onSubmit={handleUpdate}
            onCancel={() => setEditDialogOpen(false)}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Tenant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the tenant record for {tenant.firstName} {tenant.lastName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TenantDetail;