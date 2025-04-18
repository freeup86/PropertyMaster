import React from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';
import {
  Tenant,
  CreateTenantRequest,
  UpdateTenantRequest,
} from '../services/tenantService';
import { Unit } from '../services/unitService';

interface TenantFormProps {
  initialValues?: Tenant;
  units?: Unit[];
  unitId?: string;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const TenantForm: React.FC<TenantFormProps> = ({
  initialValues,
  units = [],
  unitId,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const initialFormValues = initialValues
    ? {
        firstName: initialValues.firstName,
        lastName: initialValues.lastName,
        email: initialValues.email || '',
        phoneNumber: initialValues.phoneNumber || '',
        leaseStartDate: initialValues.leaseStartDate
          ? initialValues.leaseStartDate.split('T')[0]
          : '',
        leaseEndDate: initialValues.leaseEndDate
          ? initialValues.leaseEndDate.split('T')[0]
          : '',
        unitId: initialValues.unitId,
      }
    : {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        leaseStartDate: '',
        leaseEndDate: '',
        unitId: unitId || (units.length > 0 ? units[0].id : ''),
      };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'), // Make email required
    phoneNumber: Yup.string().required('Phone number is required'), // Make phone number required
    unitId: Yup.string().required('Unit is required'),
  });

  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Convert empty strings to null for dates
      const formattedValues = {
        ...values,
        leaseStartDate: values.leaseStartDate || null,
        leaseEndDate: values.leaseEndDate || null,
      };

      // Only call the onSubmit prop (API call) if the form is valid
      if (formik.isValid) {
        onSubmit(formattedValues);
      }
      // No need for the manual email/phone check here anymore,
      // as formik.isValid will be false if the Yup validation failed.
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            id="firstName"
            name="firstName"
            label="First Name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />

          <TextField
            fullWidth
            id="lastName"
            name="lastName"
            label="Last Name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </Box>

        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && (Boolean(formik.errors.email) || Boolean(formik.errors['email-or-phone' as keyof typeof formik.errors]))}
          helperText={formik.touched.email && (formik.errors.email || formik.errors['email-or-phone' as keyof typeof formik.errors])}
        />

        <TextField
          fullWidth
          id="phoneNumber"
          name="phoneNumber"
          label="Phone Number"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          error={formik.touched.phoneNumber && (Boolean(formik.errors.phoneNumber) || Boolean(formik.errors['email-or-phone' as keyof typeof formik.errors]))}
          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            id="leaseStartDate"
            name="leaseStartDate"
            label="Lease Start Date"
            type="date"
            value={formik.values.leaseStartDate}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            id="leaseEndDate"
            name="leaseEndDate"
            label="Lease End Date"
            type="date"
            value={formik.values.leaseEndDate}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        {!isEditing && units.length > 0 && (
          <FormControl fullWidth>
            <InputLabel id="unit-select-label">Unit</InputLabel>
            <Select
              labelId="unit-select-label"
              id="unitId"
              name="unitId"
              value={formik.values.unitId}
              label="Unit"
              onChange={formik.handleChange}
              error={formik.touched.unitId && Boolean(formik.errors.unitId)}
            >
              {units.map((unit) => (
                <MenuItem key={unit.id} value={unit.id}>
                  Unit {unit.unitNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            {isEditing ? 'Update Tenant' : 'Add Tenant'}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default TenantForm;