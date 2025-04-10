import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Box, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import propertyService, { Property } from '../services/propertyService';

const PropertiesList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await propertyService.getProperties();
        setProperties(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load properties. Please try again later.');
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">My Properties</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/properties/new"
        >
          Add Property
        </Button>
      </Box>

      {properties.length === 0 ? (
        <Box textAlign="center" p={4}>
          <Typography variant="h6" gutterBottom>
            You don't have any properties yet.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Add your first property to start tracking its performance.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/properties/new"
            sx={{ mt: 2 }}
          >
            Add Property
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {properties.map((property) => (
            <Card key={property.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' }, display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {property.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </Typography>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Box sx={{ width: '50%' }}>
                    <Typography variant="caption" color="textSecondary">
                      Current Value
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(property.currentValue)}
                    </Typography>
                  </Box>
                  <Box sx={{ width: '50%' }}>
                    <Typography variant="caption" color="textSecondary">
                      Acquisition Price
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(property.acquisitionPrice)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  component={RouterLink} 
                  to={`/properties/${property.id}`}
                >
                  View Details
                </Button>
                <Button 
                  size="small" 
                  color="primary" 
                  component={RouterLink} 
                  to={`/properties/${property.id}/edit`}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default PropertiesList;