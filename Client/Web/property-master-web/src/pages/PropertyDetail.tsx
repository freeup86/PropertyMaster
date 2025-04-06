import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
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
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import propertyService, { Property } from '../services/propertyService';
import UnitManager from '../components/UnitManager';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (id) {
          const data = await propertyService.getProperty(id);
          setProperty(data);
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to load property. Please try again later.');
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (id) {
        await propertyService.deleteProperty(id);
        navigate('/properties');
      }
    } catch (err) {
      setError('Failed to delete property. Please try again.');
    }
    setDeleteDialogOpen(false);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPropertyTypeLabel = (type: number): string => {
    const typeMap: { [key: number]: string } = {
      0: 'Single Family',
      1: 'Multi Family',
      2: 'Condominium',
      3: 'Apartment',
      4: 'Commercial',
      5: 'Other',
    };
    return typeMap[type] || 'Unknown';
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !property) {
    return (
      <Container>
        <Alert severity="error">{error || 'Property not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <Button 
          component={RouterLink} 
          to="/properties"
          color="inherit"
          sx={{ mr: 2 }}
        >
          Back to Properties
        </Button>
        <Typography variant="h4">{property.name}</Typography>
      </Box>
      <Box display="flex" mb={3}>
        <Chip 
          icon={<HomeIcon />} 
          label={getPropertyTypeLabel(property.type)} 
          sx={{ mr: 1 }} 
        />
        <Chip label={`${property.city}, ${property.state}`} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Property Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Address
                </Typography>
                <Typography variant="body1">
                  {property.address}, {property.city}, {property.state} {property.zipCode}, {property.country}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Acquisition Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(property.acquisitionDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Last Valuation Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(property.lastValuationDate)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Financial Overview
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Acquisition Price
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(property.acquisitionPrice)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Current Value
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(property.currentValue)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Appreciation
                </Typography>
                <Typography 
                  variant="body1"
                  color={property.currentValue >= property.acquisitionPrice ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(property.currentValue - property.acquisitionPrice)} 
                  ({((property.currentValue - property.acquisitionPrice) / property.acquisitionPrice * 100).toFixed(1)}%)
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Units
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <UnitManager propertyId={property.id} />
          </Paper>

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
                component={RouterLink}
                to={`/properties/${property.id}/edit`}
                fullWidth
              >
                Edit Property
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                fullWidth
              >
                Delete Property
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{property.name}"? This action cannot be undone.
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

export default PropertyDetail;