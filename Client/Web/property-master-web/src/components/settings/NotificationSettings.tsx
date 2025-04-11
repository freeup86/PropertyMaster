// src/components/settings/NotificationSettings.tsx
import React, { useState, useEffect } from 'react';
import { 
    Paper, 
    Typography, 
    Box, 
    Switch, 
    FormControlLabel, 
    Button, 
    TextField, 
    Divider, 
    Alert, 
    CircularProgress,
    Snackbar
} from '@mui/material';
import { NotificationSettings as NotificationSettingsType } from '../../services/notificationService';
import NotificationService from '../../services/notificationService';

const NotificationSettings: React.FC = () => {
    const [settings, setSettings] = useState<NotificationSettingsType>({
        leaseExpirationReminders: true,
        rentDueReminders: true,
        maintenanceReminders: true,
        advanceNoticeDays: 30
    });
    
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [testEmail, setTestEmail] = useState<string>('');
    const [testingSendEmail, setTestingSendEmail] = useState<boolean>(false);
    const [testEmailSent, setTestEmailSent] = useState<boolean>(false);
    
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const data = await NotificationService.getNotificationSettings();
                setSettings(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching notification settings:', err);
                setError('Failed to load notification settings. Please try again later.');
                setLoading(false);
            }
        };
        
        fetchSettings();
    }, []);
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked, value } = event.target;
        
        if (name === 'advanceNoticeDays') {
            const days = parseInt(value);
            if (!isNaN(days) && days > 0 && days <= 90) {
                setSettings(prev => ({ ...prev, [name]: days }));
            }
        } else {
            setSettings(prev => ({ ...prev, [name]: checked }));
        }
    };
    
    const handleSave = async () => {
        try {
            setSaving(true);
            await NotificationService.updateNotificationSettings(settings);
            setSuccess(true);
            setSaving(false);
        } catch (err) {
            console.error('Error saving notification settings:', err);
            setError('Failed to save notification settings. Please try again.');
            setSaving(false);
        }
    };
    
    const handleTestEmail = async () => {
        try {
            if (!testEmail || !testEmail.includes('@')) {
                setError('Please enter a valid email address.');
                return;
            }
            
            setTestingSendEmail(true);
            const success = await NotificationService.sendTestNotification(testEmail, 'TEST');
            setTestEmailSent(success);
            setTestingSendEmail(false);
        } catch (err) {
            console.error('Error sending test email:', err);
            setError('Failed to send test email. Please try again.');
            setTestingSendEmail(false);
        }
    };
    
    const handleCloseSnackbar = () => {
        setSuccess(false);
        setTestEmailSent(false);
    };
    
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
            </Box>
        );
    }
    
    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>Notification Settings</Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            
            <Box my={3}>
                <Typography variant="h6" gutterBottom>Email Notifications</Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                    Configure when you receive email notifications about your properties.
                </Typography>
                
                <Box mb={2}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.leaseExpirationReminders}
                                onChange={handleChange}
                                name="leaseExpirationReminders"
                                color="primary"
                            />
                        }
                        label="Lease Expiration Reminders"
                    />
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', ml: 4 }}>
                        Receive notifications when tenant leases are about to expire.
                    </Typography>
                </Box>
                
                <Box mb={2}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.rentDueReminders}
                                onChange={handleChange}
                                name="rentDueReminders"
                                color="primary"
                            />
                        }
                        label="Rent Due Reminders"
                    />
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', ml: 4 }}>
                        Receive notifications when rent payments are due.
                    </Typography>
                </Box>
                
                <Box mb={2}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.maintenanceReminders}
                                onChange={handleChange}
                                name="maintenanceReminders"
                                color="primary"
                            />
                        }
                        label="Maintenance Request Updates"
                    />
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', ml: 4 }}>
                        Receive notifications when maintenance requests are updated.
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        Send notifications
                    </Typography>
                    <TextField
                        name="advanceNoticeDays"
                        type="number"
                        value={settings.advanceNoticeDays}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        InputProps={{ inputProps: { min: 1, max: 90 } }}
                        sx={{ width: 80 }}
                    />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                        days in advance
                    </Typography>
                </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
                <Typography variant="h6" gutterBottom>Test Notifications</Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                    Send a test notification to verify your email setup.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        label="Email Address"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        sx={{ maxWidth: 300 }}
                    />
                    <Button 
                        variant="outlined" 
                        onClick={handleTestEmail}
                        disabled={testingSendEmail}
                    >
                        {testingSendEmail ? <CircularProgress size={24} /> : 'Send Test Email'}
                    </Button>
                </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? <CircularProgress size={24} /> : 'Save Settings'}
                </Button>
            </Box>
            
            <Snackbar
                open={success || testEmailSent}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={success ? "Settings saved successfully" : "Test email sent successfully"}
            />
        </Paper>
    );
};

export default NotificationSettings;