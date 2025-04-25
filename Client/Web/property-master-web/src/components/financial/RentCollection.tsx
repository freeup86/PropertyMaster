import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import tenantService, { Tenant } from '../../services/tenantService';
import transactionService from '../../services/transactionService';
import unitService from '../../services/unitService';

interface RentCollectionProps {
  propertyId: string;
}

const RentCollection: React.FC<RentCollectionProps> = ({ propertyId }) => {
  const [tenants, setTenants] = useState<(Tenant & { marketRent?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<(Tenant & { marketRent?: number }) | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState(dayjs());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchTenantsWithRent = async () => {
      try {
        // Fetch tenants for the property
        const tenantsData = await tenantService.getTenantsByProperty(propertyId);
        
        // Fetch market rent for each tenant's unit
        const tenantsWithRent = await Promise.all(
          tenantsData.map(async (tenant) => {
            try {
              const unit = await unitService.getUnit(propertyId, tenant.unitId);
              return { ...tenant, marketRent: unit.marketRent };
            } catch (unitError) {
              console.error(`Failed to fetch unit for tenant ${tenant.id}`, unitError);
              return { ...tenant, marketRent: undefined };
            }
          })
        );

        setTenants(tenantsWithRent);
        setLoading(false);
      } catch (err) {
        setError('Failed to load tenants');
        setLoading(false);
      }
    };

    fetchTenantsWithRent();
  }, [propertyId]);

  const handleOpenPaymentDialog = (tenant: Tenant & { marketRent?: number }) => {
    setSelectedTenant(tenant);
    setOpenPaymentDialog(true);
    // Set default payment amount to the unit's market rent
    setPaymentAmount(tenant.marketRent?.toString() || '');
  };

  const handleRecordPayment = async () => {
    if (!selectedTenant) {
      setError('No tenant selected');
      return;
    }

    try {
      await transactionService.createRentTransaction(
        propertyId, 
        selectedTenant.unitId, 
        parseFloat(paymentAmount), 
        `${selectedTenant.firstName} ${selectedTenant.lastName}`
      );

      // Show success message
      setSnackbarMessage('Rent payment recorded successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Close dialog and reset state
      setOpenPaymentDialog(false);
      setSelectedTenant(null);
      setPaymentAmount('');
    } catch (err) {
      // Show error message
      setSnackbarMessage('Failed to record rent payment');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <Typography>Loading tenants...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Rent Collection (records will show in Transactions Tab)
      </Typography>
      
      {tenants.length === 0 ? (
        <Typography>No tenants found for this property</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tenant Name</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Market Rent</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    {tenant.firstName} {tenant.lastName}
                  </TableCell>
                  <TableCell>Unit {tenant.unitNumber}</TableCell>
                  <TableCell>
                    {tenant.marketRent 
                      ? new Intl.NumberFormat('en-US', { 
                          style: 'currency', 
                          currency: 'USD' 
                        }).format(tenant.marketRent)
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small"
                      onClick={() => handleOpenPaymentDialog(tenant)}
                    >
                      Collect Rent
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Payment Dialog */}
      <Dialog 
        open={openPaymentDialog} 
        onClose={() => setOpenPaymentDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Record Rent Payment</DialogTitle>
        <DialogContent>
          {selectedTenant && (
            <Box>
              <Typography variant="subtitle1">
                {selectedTenant.firstName} {selectedTenant.lastName} - Unit {selectedTenant.unitNumber}
              </Typography>
              
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Payment Date"
                  value={paymentDate}
                  onChange={(newValue) => setPaymentDate(newValue || dayjs())}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                    },
                  }}
                />
              </LocalizationProvider>
              
              <TextField
                fullWidth
                margin="normal"
                label="Payment Amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                InputProps={{
                  startAdornment: '$'
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleRecordPayment} 
            color="primary" 
            variant="contained"
          >
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RentCollection;