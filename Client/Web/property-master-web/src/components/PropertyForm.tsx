import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Box,
  Typography,
  MenuItem
} from '@mui/material';
import { Property } from '../services/propertyService';

interface PropertyFormProps {
  initialValues?: Property;
  onSubmit: (values: any) => void;
  isEditing?: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  initialValues, 
  onSubmit, 
  isEditing = false 
}) => {
  const propertyTypes = [
    { value: 0, label: 'Single Family' },
    { value: 1, label: 'Multi Family' },
    { value: 2, label: 'Condominium' },
    { value: 3, label: 'Apartment' },
    { value: 4, label: 'Commercial' },
    { value: 5, label: 'Other' }
  ];

  const initialFormValues = initialValues ? {
    name: initialValues.name,
    address: initialValues.address,
    city: initialValues.city,
    state: initialValues.state,
    zipCode: initialValues.zipCode,
    country: initialValues.country,
    type: initialValues.type,
    acquisitionDate: initialValues.acquisitionDate.split('T')[0],
    acquisitionPrice: initialValues.acquisitionPrice,
    currentValue: initialValues.currentValue
  } : {
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    type: 0,
    acquisitionDate: new Date().toISOString().split('T')[0],
    acquisitionPrice: 0,
    currentValue: 0
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Property name is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('Zip code is required'),
    country: Yup.string().required('Country is required'),
    acquisitionDate: Yup.date().required('Acquisition date is required'),
    acquisitionPrice: Yup.number()
      .required('Acquisition price is required')
      .positive('Acquisition price must be positive'),
    currentValue: Yup.number()
      .required('Current value is required')
      .positive('Current value must be positive')
  });

  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h6">Property Information</Typography>
        </Box>
        
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Property Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        
        <TextField
          fullWidth
          id="address"
          name="address"
          label="Address"
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 100%', minWidth: { xs: '100%', sm: '45%' } }}>
            <TextField
              fullWidth
              id="city"
              name="city"
              label="City"
              value={formik.values.city}
              onChange={formik.handleChange}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
            />
          </Box>
          
          <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: '20%' } }}>
            <TextField
              fullWidth
              id="state"
              name="state"
              label="State"
              value={formik.values.state}
              onChange={formik.handleChange}
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
            />
          </Box>
          
          <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: '20%' } }}>
            <TextField
              fullWidth
              id="zipCode"
              name="zipCode"
              label="Zip Code"
              value={formik.values.zipCode}
              onChange={formik.handleChange}
              error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
              helperText={formik.touched.zipCode && formik.errors.zipCode}
            />
          </Box>
        </Box>
        
        <TextField
          fullWidth
          id="country"
          name="country"
          label="Country"
          value={formik.values.country}
          onChange={formik.handleChange}
          error={formik.touched.country && Boolean(formik.errors.country)}
          helperText={formik.touched.country && formik.errors.country}
        />
        
        <TextField
          fullWidth
          id="type"
          name="type"
          select
          label="Property Type"
          value={formik.values.type}
          onChange={formik.handleChange}
          error={formik.touched.type && Boolean(formik.errors.type)}
          helperText={formik.touched.type && formik.errors.type}
        >
          {propertyTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        
        <Box>
          <Typography variant="h6">Financial Information</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: '30%' } }}>
            <TextField
              fullWidth
              id="acquisitionDate"
              name="acquisitionDate"
              label="Acquisition Date"
              type="date"
              value={formik.values.acquisitionDate}
              onChange={formik.handleChange}
              error={formik.touched.acquisitionDate && Boolean(formik.errors.acquisitionDate)}
              helperText={formik.touched.acquisitionDate && formik.errors.acquisitionDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          
          <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: '30%' } }}>
            <TextField
              fullWidth
              id="acquisitionPrice"
              name="acquisitionPrice"
              label="Acquisition Price"
              type="number"
              value={formik.values.acquisitionPrice}
              onChange={formik.handleChange}
              error={formik.touched.acquisitionPrice && Boolean(formik.errors.acquisitionPrice)}
              helperText={formik.touched.acquisitionPrice && formik.errors.acquisitionPrice}
            />
          </Box>
          
          <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: '30%' } }}>
            <TextField
              fullWidth
              id="currentValue"
              name="currentValue"
              label="Current Value"
              type="number"
              value={formik.values.currentValue}
              onChange={formik.handleChange}
              error={formik.touched.currentValue && Boolean(formik.errors.currentValue)}
              helperText={formik.touched.currentValue && formik.errors.currentValue}
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            {isEditing ? 'Update Property' : 'Add Property'}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default PropertyForm;