// In PropertyDetail.tsx, add a Tabs component to switch between units and tenants

import React, { useEffect, useState } from 'react';
import PropertyFinancialDashboard from '../components/financial/PropertyFinancialDashboard';
import TransactionManager from '../components/financial/TransactionManager';
import DocumentManager from '../components/documents/DocumentManager';

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
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import propertyService, { Property } from '../services/propertyService';
import UnitManager from '../components/UnitManager';
import TenantManager from '../components/TenantManager';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`property-tabpanel-${index}`}
      aria-labelledby={`property-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ 
          flex: '1 1 auto', 
          minWidth: { xs: '100%', md: '60%' } 
        }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Property Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Address
                </Typography>
                <Typography variant="body1">
                  {property.address}, {property.city}, {property.state} {property.zipCode}, {property.country}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: '45%' } }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Acquisition Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(property.acquisitionDate)}
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: '45%' } }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Last Valuation Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(property.lastValuationDate)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Financial Overview
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: '45%' } }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Acquisition Price
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(property.acquisitionPrice)}
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: '45%' } }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Current Value
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(property.currentValue)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: '45%' } }}>
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
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ 
          flex: '1 1 auto', 
          minWidth: { xs: '100%', md: '35%' } 
        }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="property tabs">
                <Tab label="Units" id="property-tab-0" aria-controls="property-tabpanel-0" />
                <Tab label="Tenants" id="property-tab-1" aria-controls="property-tabpanel-1" />
                <Tab label="Financials" id="property-tab-2" aria-controls="property-tabpanel-2" />
                <Tab label="Transactions" id="property-tab-3" aria-controls="property-tabpanel-3" />
                <Tab label="Documents" id="property-tab-4" aria-controls="property-tabpanel-4" />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <UnitManager propertyId={property.id} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <TenantManager propertyId={property.id} />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <PropertyFinancialDashboard propertyId={property.id} />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <TransactionManager propertyId={property.id} />
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <DocumentManager propertyId={property.id} />
            </TabPanel>
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
        </Box>
      </Box>

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