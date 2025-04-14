import api from './api'; // Import your configured Axios instance

// --- Interfaces matching Backend DTOs ---
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

// Matches AuthResponseDto from AuthController
interface AuthResponse {
  token: string;
  expiration: string; // ISO date string
  email: string;
  userId: string; // Guid as string
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthResponseDto {
  token: string;
  expiration: string;
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Simplified user info structure for storing in localStorage
export interface UserInfo {
   email: string;
   userId: string;
   firstName: string;
   lastName: string;
   role: string;
}

// --- Interfaces for Password Reset ---
// Matches ForgotPasswordDto
interface ForgotPasswordData {
  email: string;
}

// Matches ResetPasswordDto (excluding ConfirmPassword, which is frontend only)
interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
}
// Type for the response from forgot/reset password endpoints (if needed)
interface PasswordResponseMessage {
    message: string;
    errors?: any; // Optional field for potential validation errors on reset
}


// --- Service Functions ---

const register = async (data: RegisterData): Promise<any> => {
  try {
    const response = await api.post('/auth/register', data);
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error.response?.data || { message: 'An unknown registration error occurred' };
  }
};

const login = async (data: LoginData): Promise<AuthResponseDto> => {
  try {
    const response = await api.post<AuthResponseDto>('/auth/login', data);
    if (response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      const userInfo: UserInfo = {
        email: response.data.email,
        userId: response.data.userId,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        role: response.data.role // Add this line
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      console.log('Login successful, token stored.');
    }
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data || { message: 'An unknown login error occurred' };
  }
};


const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userInfo');
  console.log('Logged out, token removed.');
  // Example: window.location.href = '/login';
};

const getCurrentUser = (): UserInfo | null => {
  const userInfoStr = localStorage.getItem('userInfo');
  try {
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (error) {
    console.error("Error parsing user info from localStorage:", error);
    localStorage.removeItem('userInfo');
    return null;
  }
};


const getToken = (): string | null => {
    return localStorage.getItem('authToken');
};

// --- Add forgotPassword function ---
const forgotPassword = async (email: string): Promise<PasswordResponseMessage> => {
  try {
    const response = await api.post<PasswordResponseMessage>('/auth/forgot-password', { email });
    console.log('Forgot password request successful:', response.data);
    // Backend always returns 200 OK for this, message confirms initiation
    return response.data;
  } catch (error: any) {
    console.error("Forgot password error:", error.response?.data || error.message);
    // Rethrow error for the component
    throw error.response?.data || { message: 'An unknown error occurred requesting password reset' };
  }
};

// --- Add resetPassword function ---
const resetPassword = async (data: ResetPasswordData): Promise<PasswordResponseMessage> => {
    try {
        const response = await api.post<PasswordResponseMessage>('/auth/reset-password', data);
        console.log('Reset password successful:', response.data);
        return response.data; // Should contain { message: "..." } on success
    } catch (error: any) {
        console.error("Reset password error:", error.response?.data || error.message);
        // Rethrow error data for the component (might include validation errors)
        throw error.response?.data || { message: 'An unknown error occurred resetting the password' };
    }
};


// Export all functions, including the new ones
export const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  forgotPassword, // Add new function
  resetPassword,  // Add new function
};