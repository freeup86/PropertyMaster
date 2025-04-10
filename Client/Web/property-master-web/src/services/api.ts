import axios from 'axios';
// Import the auth service we created
import { authService } from './authService';

// Your API base URL (ensure port matches backend launchSettings.json if needed)
const API_URL = 'http://localhost:5044/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Add Request Interceptor ---
api.interceptors.request.use(
  (config) => {
    // Get the token from storage using the authService function
    const token = authService.getToken();
    if (token) {
      // If token exists, add the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle request configuration errors
    console.error("Axios request interceptor error:", error);
    return Promise.reject(error);
  }
);

// --- Add Response Interceptor ---
api.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx cause this function to trigger
    // Simply return the successful response
    return response;
  },
  (error) => {
    // Any status codes outside the range of 2xx cause this function to trigger
    const originalRequest = error.config; // The original request config

    // Check if the error is a 401 Unauthorized response
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized (401) response detected. Logging out.");
      // Call the logout function from authService
      authService.logout();

      // Redirect the user to the login page
      // Use window.location for a simple redirect, or integrate with your routing library later
      // Avoid doing this if the original request was for login/register to prevent loops
      if (!originalRequest.url?.includes('/auth/login') && !originalRequest.url?.includes('/auth/register')) {
         window.location.href = '/login'; // Adjust the path if your login route is different
      }

      // Return a rejected promise to stop the original request flow
      return Promise.reject(error.response?.data || { message: 'Unauthorized' });
    }

    // For any other errors, just pass them through
    console.error("Axios response interceptor error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);


export default api;