// src/components/Auth/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/authService'; // Adjust path if needed
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // For link back to login

const ForgotPasswordForm: React.FC = () => {
  // State to hold success/error messages after submission attempt
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: async (values) => {
      setMessage(null); // Clear previous messages
      setIsError(false);
      setLoading(true);
      try {
        // Call the forgotPassword service function
        const response = await authService.forgotPassword(values.email);
        // Display the success message from the backend (which is always generic)
        setMessage(response.message);
        setIsError(false); // Ensure it's shown as success/info
      } catch (err: any) {
        // Display a generic error or the specific one if available
        setMessage(err.message || 'An unexpected error occurred.');
        setIsError(true);
      } finally {
        setLoading(false);
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
        mt: 5,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Forgot Password
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2 }}>
        Enter your email address and we'll send you a link to reset your password (if an account exists).
      </Typography>

      {/* Display Success/Error messages */}
      {message && (
        <Alert severity={isError ? 'error' : 'success'} sx={{ width: '100%', mb: 2 }}>
          {message}
        </Alert>
      )}

      <TextField
        fullWidth
        id="email"
        name="email"
        label="Email Address"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        margin="normal"
        disabled={loading} // Disable field while loading
      />

      <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          disabled={loading || !formik.isValid || !!message && !isError} // Disable if loading, invalid, or success message shown
          sx={{ mt: 3, mb: 2, position: 'relative' }}
      >
          Send Reset Link
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
      <Typography variant="body2">
         Remembered your password? <RouterLink to="/login">Log In</RouterLink>
       </Typography>
    </Box>
  );
};

export default ForgotPasswordForm;