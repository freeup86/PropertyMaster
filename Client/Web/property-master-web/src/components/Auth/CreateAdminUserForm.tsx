import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert 
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/authService';

const CreateAdminUserForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
      lastName: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        setError(null);
        setSuccess(null);
        
        await authService.createAdminUser(values);
        
        setSuccess('Admin user created successfully!');
        formik.resetForm();
      } catch (err: any) {
        setError(err.message || 'Failed to create admin user');
      }
    },
  });

  return (
    <Box 
      component="form" 
      onSubmit={formik.handleSubmit}
      sx={{ 
        maxWidth: 400, 
        margin: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2 
      }}
    >
      <Typography variant="h5">Create Admin User</Typography>
      
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

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
      <TextField
        fullWidth
        id="email"
        name="email"
        label="Email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />
      <TextField
        fullWidth
        id="password"
        name="password"
        label="Password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      />
      <Button 
        color="primary" 
        variant="contained" 
        fullWidth 
        type="submit"
        disabled={formik.isSubmitting}
      >
        Create Admin User
      </Button>
    </Box>
  );
};

export default CreateAdminUserForm;