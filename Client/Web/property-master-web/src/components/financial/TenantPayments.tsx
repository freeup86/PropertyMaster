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
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import transactionService, { Transaction, TransactionType } from '../../services/transactionService';

interface TenantPaymentsProps {
  tenantId: string;
}

const TenantPayments: React.FC<TenantPaymentsProps> = ({ tenantId }) => {
  const [payments, setPayments] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenantPayments = async () => {
      try {
        // Fetch transactions for the specific tenant
        // Note: You might need to update the transaction service to support this
        const tenantTransactions = await transactionService.getTransactionsByTenant(tenantId);
        
        // Filter only income transactions (payments)
        const tenantPayments = tenantTransactions.filter(
          transaction => transaction.type === TransactionType.Income
        );

        setPayments(tenantPayments);
        setLoading(false);
      } catch (err) {
        setError('Failed to load tenant payments');
        setLoading(false);
      }
    };

    fetchTenantPayments();
  }, [tenantId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment History
      </Typography>
      
      {payments.length === 0 ? (
        <Typography>No payments recorded for this tenant</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{formatDate(payment.date)}</TableCell>
                  <TableCell>
                    <Typography color="success.main">
                      {formatCurrency(payment.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>{payment.categoryName}</TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={payment.isPaid ? 'Paid' : 'Pending'} 
                      color={payment.isPaid ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Summary Section */}
      <Box mt={2}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1">Payment Summary</Typography>
          <Box display="flex" justifyContent="space-between">
            <Typography>Total Payments:</Typography>
            <Typography color="success.main">
              {formatCurrency(
                payments.reduce((total, payment) => total + payment.amount, 0)
              )}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography>Number of Payments:</Typography>
            <Typography>{payments.length}</Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default TenantPayments;