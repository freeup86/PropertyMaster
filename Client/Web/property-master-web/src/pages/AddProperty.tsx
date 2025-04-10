import React, { useState } from 'react';
import { Container, Typography, Paper, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';
import propertyService from '../services/propertyService';

const AddProperty: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: any) => {
    try {
      await propertyService.createProperty(values);
      navigate('/properties');
    } catch (err) {
      setError('Failed to create property. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add New Property
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper sx={{ p: 3 }}>
        <PropertyForm onSubmit={handleSubmit} />
      </Paper>
    </Container>
  );
};

export default AddProperty;