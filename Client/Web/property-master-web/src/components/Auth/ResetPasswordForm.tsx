// src/components/Auth/ResetPasswordForm.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/authService'; // Adjust path if needed
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook to read URL query parameters

  // State for messages and loading
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // State to hold token and email from URL
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // Effect to extract token and email from URL on component mount
  useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');

    if (urlToken && urlEmail) {
      // Basic validation or display - token is URL encoded, might need decode here if issues arise
      // but often backend handles potential encoding inconsistencies if passed in body
      setToken(urlToken);
      setEmail(urlEmail);
    } else {
      setMessage("Invalid password reset link. Token or email missing from URL.");
      setIsError(true);
    }
  }, [searchParams]); // Re-run if searchParams change

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        // Add other password requirements to match backend/Identity options
        .required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      // Ensure token and email were successfully extracted
      if (!token || !email) {
         setMessage("Cannot reset password. Link details are missing.");
         setIsError(true);
         return;
      }

      setMessage(null);
      setIsError(false);
      setLoading(true);

      try {
        // Call the resetPassword service function
        const response = await authService.resetPassword({
          email: email,
          token: token, // Pass the token from the URL
          password: values.password,
        });
        setMessage(response.message + " Redirecting to login..."); // Show success message
        setIsError(false);
        // Redirect to login page after a short delay
        setTimeout(() => {
            navigate('/login');
        }, 3000); // 3-second delay
      } catch (err: any) {
        // Handle errors, potentially showing specific messages from backend
         setMessage(err.message || 'An unexpected error occurred while resetting password.');
         setIsError(true);
      } finally {
        setLoading(false);
      }
    },
  });

  // Render nothing or an error if token/email are missing initially
  if (!token || !email) {
     return (
        <Box sx={{ maxWidth: 400, margin: 'auto', mt: 5, padding: 3 }}>
             {message && <Alert severity="error">{message}</Alert>}
             {!message && <Typography>Loading reset details...</Typography>}
              <Typography variant="body2" sx={{mt: 2}}>
                Go back to <RouterLink to="/login">Login</RouterLink>
             </Typography>
        </Box>
     );
  }


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
        Reset Your Password
      </Typography>
       <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2 }}>
        Enter your new password below for {email}.
      </Typography>

      {/* Display Success/Error messages */}
      {message && (
        <Alert severity={isError ? 'error' : 'success'} sx={{ width: '100%', mb: 2 }}>
          {message}
        </Alert>
      )}

      <TextField
        fullWidth
        id="password"
        name="password"
        label="New Password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        margin="normal"
        disabled={loading || (!!message && !isError)} // Disable if loading or success message shown
      />
      <TextField
        fullWidth
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm New Password"
        type="password"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        margin="normal"
         disabled={loading || (!!message && !isError)} // Disable if loading or success message shown
      />

      <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          disabled={loading || !formik.isValid || (!!message && !isError)} // Disable if loading, invalid or success
          sx={{ mt: 3, mb: 2, position: 'relative' }}
      >
          Reset Password
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
         Back to <RouterLink to="/login">Login</RouterLink>
       </Typography>
    </Box>
  );
};

export default ResetPasswordForm;