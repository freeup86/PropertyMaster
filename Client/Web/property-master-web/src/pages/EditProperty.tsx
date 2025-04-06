import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';
import propertyService, { Property, UpdatePropertyRequest } from '../services/propertyService';

const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (values: UpdatePropertyRequest) => {
    try {
      if (id) {
        await propertyService.updateProperty(id, values);
        navigate(`/properties/${id}`);
      }
    } catch (err) {
      setError('Failed to update property. Please try again.');
    }
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Property
      </Typography>
      <Paper sx={{ p: 3 }}>
        <PropertyForm
          initialValues={property}
          onSubmit={handleSubmit}
          isEditing
        />
      </Paper>
    </Container>
  );
};

export default EditProperty;