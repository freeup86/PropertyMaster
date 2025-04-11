import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Container, 
  Paper 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MaintenanceRequestService from '../services/maintenanceRequestService';
import unitService from '../services/unitService';
import propertyService from '../services/propertyService';
import { CreateMaintenanceRequestDto, UnitDto, PropertyDto } from '../types/MaintenanceRequestTypes';
import { SelectChangeEvent } from '@mui/material/Select';


const CreateMaintenanceRequest: React.FC = () => {
  const navigate = useNavigate();
  const [units, setUnits] = useState<UnitDto[]>([]);
  const [properties, setProperties] = useState<PropertyDto[]>([]);
  const [request, setRequest] = useState<CreateMaintenanceRequestDto>({
    unitId: '', 
    propertyId: '',
    requestDate: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    priority: 'Medium',
    tenantId: undefined
  });

  // Predefined categories and priorities
  const maintenanceCategories = [
    'Plumbing',
    'Electrical',
    'HVAC',
    'Structural',
    'Appliance',
    'Painting',
    'Flooring',
    'Other'
  ];

  const priorityLevels = [
    { value: 'Low', label: 'Low Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'High', label: 'High Priority' }
  ];

  // Fetch properties and units on component mount
  useEffect(() => {
    const fetchUnitsAndProperties = async () => {
      try {
        const fetchedProperties = await propertyService.getProperties();
        setProperties(fetchedProperties);

        if (fetchedProperties.length > 0) {
          const firstPropertyId = fetchedProperties[0].id;
          setRequest(prevRequest => ({ 
            ...prevRequest, 
            propertyId: firstPropertyId 
          }));
          
          const fetchedUnits = await unitService.getUnits(firstPropertyId);
          setUnits(fetchedUnits);
          
          if (fetchedUnits.length > 0) {
            setRequest(prevRequest => ({ 
              ...prevRequest, 
              unitId: fetchedUnits[0].id 
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching units or properties:', error);
      }
    };

    fetchUnitsAndProperties();
  }, []);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setRequest((prevRequest: CreateMaintenanceRequestDto) => ({
      ...prevRequest,
      [name]: value,
    }));

    // Special handling for property selection to update units
    if (name === 'propertyId') {
      const fetchUnits = async () => {
        try {
          const fetchedUnits = await unitService.getUnits(value);
          setUnits(fetchedUnits);
          
          if (fetchedUnits.length > 0) {
            setRequest(prevRequest => ({ 
              ...prevRequest, 
              unitId: fetchedUnits[0].id 
            }));
          } else {
            setRequest(prevRequest => ({ 
              ...prevRequest, 
              unitId: '' 
            }));
          }
        } catch (error) {
          console.error('Error fetching units for property:', error);
          setUnits([]);
          setRequest(prevRequest => ({ 
            ...prevRequest, 
            unitId: '' 
          }));
        }
      };
      fetchUnits();
    }
  };

  // Submit form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!request.unitId || !request.propertyId) {
      alert('Please select a property and unit');
      return;
    }

    try {
      console.log('Submitting maintenance request:', request);
      await MaintenanceRequestService.createRequest(request);
      navigate('/maintenance-requests');
    } catch (error: any) {
      console.error('Error creating maintenance request:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Full error response:', error.response);
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        
        // Display user-friendly error message
        alert(error.response.data?.message || 'Failed to create maintenance request');
      } else if (error.request) {
        console.error('Error request:', error.request);
        alert('No response received from server');
      } else {
        console.error('Error message:', error.message);
        alert('An unexpected error occurred');
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Maintenance Request
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Property Selection */}
          <FormControl fullWidth>
            <InputLabel>Property</InputLabel>
            <Select
              name="propertyId"
              value={request.propertyId}
              label="Property"
              onChange={handleInputChange}
              required
            >
              {properties.map((property) => (
                <MenuItem key={property.id} value={property.id}>
                  {property.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Unit Selection */}
          <FormControl fullWidth>
            <InputLabel>Unit</InputLabel>
            <Select
              name="unitId"
              value={request.unitId}
              label="Unit"
              onChange={handleInputChange}
              required
              disabled={units.length === 0}
            >
              {units.map((unit) => (
                <MenuItem key={unit.id} value={unit.id}>
                  {unit.unitNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Request Date */}
          <TextField
            name="requestDate"
            label="Request Date"
            type="date"
            value={request.requestDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />

          {/* Maintenance Category */}
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={request.category}
              label="Category"
              onChange={handleInputChange}
              required
            >
              {maintenanceCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Priority */}
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={request.priority}
              label="Priority"
              onChange={handleInputChange}
              required
            >
              {priorityLevels.map((level) => (
                <MenuItem key={level.value} value={level.value}>
                  {level.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Description */}
          <TextField
            name="description"
            label="Description"
            multiline
            rows={4}
            value={request.description}
            onChange={handleInputChange}
            required
            fullWidth
            placeholder="Provide details about the maintenance request"
          />

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
          >
            Create Maintenance Request
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateMaintenanceRequest;