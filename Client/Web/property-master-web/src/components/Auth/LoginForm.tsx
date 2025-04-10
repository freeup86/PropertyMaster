import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting after login
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/authService'; // Adjust path if needed
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null); // State for login errors
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      setError(null);
      setLoading(true);
      try {
        // Call the login service function
        await authService.login({
          email: values.email,
          password: values.password,
        });
        // Login successful, navigate to dashboard or home page
        // You might want to force a state refresh or page reload
        // to ensure the app recognizes the logged-in state immediately
        navigate('/dashboard'); // Redirect to a protected route (e.g., dashboard)
         window.location.reload(); // Simple way to refresh state, consider Context API for better state management
      } catch (err: any) {
        // Handle errors from the authService
        setError(err.message || 'An unexpected error occurred during login.');
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
        Login
      </Typography>

      {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

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

       <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          disabled={loading || !formik.isValid}
          sx={{ mt: 3, mb: 2, position: 'relative' }}
      >
          Login
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
      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
         <RouterLink to="/forgot-password">
           Forgot Password?
         </RouterLink>
      </Typography>

      {/* Add link to registration page */}
       <Typography variant="body2">
         Don't have an account? <a href="/register">Register</a>
       </Typography>
    </Box>
  );
};

export default LoginForm;