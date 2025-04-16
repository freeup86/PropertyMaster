import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert 
} from '@mui/material';
import { authService } from '../../services/authService';

const UserPromotionForm: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePromotion = async () => {
    try {
      setError(null);
      setSuccess(null);

      const promotedUser = await authService.promoteToAdmin(userId);
      
      setSuccess(`User ${promotedUser.email} has been promoted to admin.`);
      setUserId('');
    } catch (err: any) {
      setError(err.message || 'Failed to promote user');
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 400, 
      margin: 'auto', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2 
    }}>
      <Typography variant="h5">Promote User to Admin</Typography>
      
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <TextField
        fullWidth
        label="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter user ID to promote"
      />

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handlePromotion}
        disabled={!userId}
      >
        Promote to Admin
      </Button>
    </Box>
  );
};

export default UserPromotionForm;