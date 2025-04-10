import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Box,
  Switch,
  FormControlLabel,
  InputAdornment
} from '@mui/material';
import { Unit, CreateUnitRequest, UpdateUnitRequest } from '../services/unitService';

interface UnitFormProps {
  initialValues?: Unit;
  onSubmit: (values: any) => void; // Use 'any' to bypass TypeScript checking
  onCancel: () => void;
  isEditing?: boolean;
}

const UnitForm: React.FC<UnitFormProps> = ({ 
  initialValues, 
  onSubmit, 
  onCancel,
  isEditing = false 
}) => {
  
  const initialFormValues = initialValues ? {
    unitNumber: initialValues.unitNumber,
    size: initialValues.size,
    bedrooms: initialValues.bedrooms,
    bathrooms: initialValues.bathrooms,
    marketRent: initialValues.marketRent,
    isOccupied: initialValues.isOccupied
  } : {
    unitNumber: '',
    size: 0,
    bedrooms: 1,
    bathrooms: 1,
    marketRent: 0,
    isOccupied: false
  };

  const validationSchema = Yup.object({
    unitNumber: Yup.string().required('Unit number is required'),
    size: Yup.number().min(0, 'Size must be at least 0'),
    bedrooms: Yup.number().min(0, 'Bedrooms must be at least 0').integer('Bedrooms must be a whole number'),
    bathrooms: Yup.number().min(0, 'Bathrooms must be at least 0'),
    marketRent: Yup.number().min(0, 'Market rent must be at least 0')
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          id="unitNumber"
          name="unitNumber"
          label="Unit Number"
          value={formik.values.unitNumber}
          onChange={formik.handleChange}
          error={formik.touched.unitNumber && Boolean(formik.errors.unitNumber)}
          helperText={formik.touched.unitNumber && formik.errors.unitNumber}
        />
        
        <TextField
          fullWidth
          id="size"
          name="size"
          label="Size"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">sq ft</InputAdornment>,
          }}
          value={formik.values.size}
          onChange={formik.handleChange}
          error={formik.touched.size && Boolean(formik.errors.size)}
          helperText={formik.touched.size && formik.errors.size}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            id="bedrooms"
            name="bedrooms"
            label="Bedrooms"
            type="number"
            value={formik.values.bedrooms}
            onChange={formik.handleChange}
            error={formik.touched.bedrooms && Boolean(formik.errors.bedrooms)}
            helperText={formik.touched.bedrooms && formik.errors.bedrooms}
          />
          
          <TextField
            fullWidth
            id="bathrooms"
            name="bathrooms"
            label="Bathrooms"
            type="number"
            value={formik.values.bathrooms}
            onChange={formik.handleChange}
            error={formik.touched.bathrooms && Boolean(formik.errors.bathrooms)}
            helperText={formik.touched.bathrooms && formik.errors.bathrooms}
          />
        </Box>
        
        <TextField
          fullWidth
          id="marketRent"
          name="marketRent"
          label="Market Rent"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={formik.values.marketRent}
          onChange={formik.handleChange}
          error={formik.touched.marketRent && Boolean(formik.errors.marketRent)}
          helperText={formik.touched.marketRent && formik.errors.marketRent}
        />
        
        <FormControlLabel
          control={
            <Switch
              id="isOccupied"
              name="isOccupied"
              checked={formik.values.isOccupied}
              onChange={formik.handleChange}
              color="primary"
            />
          }
          label="Currently Occupied"
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            {isEditing ? 'Update Unit' : 'Add Unit'}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default UnitForm;