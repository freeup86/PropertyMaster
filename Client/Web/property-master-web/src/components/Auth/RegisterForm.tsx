import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting after registration
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/authService'; // Adjust path if needed
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material'; // Material UI components

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null); // State to hold registration errors
  const [loading, setLoading] = useState<boolean>(false); // State for loading indicator

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '', // Added for password confirmation
    },
    validationSchema: Yup.object({
      firstName: Yup.string().max(100, 'Must be 100 characters or less').required('Required'),
      lastName: Yup.string().max(100, 'Must be 100 characters or less').required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        // Add other password requirements if needed (matches backend)
        .required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match') // Use 'undefined' for Yup >= 1.0
        .required('Required'),
    }),
    onSubmit: async (values) => {
      setError(null); // Clear previous errors
      setLoading(true); // Show loading indicator
      try {
        // Call the register service function (don't send confirmPassword to backend)
        await authService.register({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        });
        // Registration successful, navigate to login page or show success message
        alert('Registration successful! Please log in.'); // Simple alert, replace with better UX
        navigate('/login'); // Redirect to login page
      } catch (err: any) {
        // Handle errors from the authService
        setError(err.message || 'An unexpected error occurred during registration.');
      } finally {
        setLoading(false); // Hide loading indicator
      }
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 400,
        margin: 'auto',
        padding: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
        mt: 5, // Margin top
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Register
      </Typography>

      {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        id="firstName"
        name="firstName"
        label="First Name"
        value={formik.values.firstName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
        helperText={formik.touched.firstName && formik.errors.firstName}
        margin="normal"
      />
      <TextField
        fullWidth
        id="lastName"
        name="lastName"
        label="Last Name"
        value={formik.values.lastName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
        helperText={formik.touched.lastName && formik.errors.lastName}
        margin="normal"
      />
      <TextField
        fullWidth
        id="email"
        name="email"
        label="Email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        margin="normal"
      />
      <TextField
        fullWidth
        id="password"
        name="password"
        label="Password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        margin="normal"
      />
      <TextField
        fullWidth
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        margin="normal"
      />

      <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          disabled={loading || !formik.isValid} // Disable button if loading or form invalid
          sx={{ mt: 3, mb: 2, position: 'relative' }}
      >
          Register
          {loading && (
          <CircularProgress
              size={24}
              sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
              }}
          />
          )}
      </Button>
      {/* Add link to login page */}
       <Typography variant="body2">
         Already have an account? <a href="/login">Log In</a>
       </Typography>
    </Box>
  );
};

export default RegisterForm;