// TransactionManager.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  Chip,
  DialogActions,
  DialogContentText,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as ExpenseIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

import TransactionForm from './TransactionForm';
import transactionService, { Transaction, TransactionType } from '../../services/transactionService';
import categoryService, { Category } from '../../services/categoryService';

interface TransactionManagerProps {
  propertyId: string;
  unitId?: string;
}

const TransactionManager: React.FC<TransactionManagerProps> = ({ propertyId, unitId }) => {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load transactions and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedTransactions = unitId 
          ? await transactionService.getTransactionsByUnit(unitId)
          : await transactionService.getTransactionsByProperty(propertyId);
        
        const fetchedCategories = await categoryService.getCategories();
        
        setTransactions(fetchedTransactions);
        setCategories(fetchedCategories);
        setLoading(false);
      } catch (err) {
        setError('Failed to load transactions. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [propertyId, unitId]);

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setIsEditing(false);
    setOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDeleteDialogOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTransaction(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleCreateTransaction = async (values: any) => {
    try {
      await transactionService.createTransaction(values);
      // Refresh transactions
      const refreshedTransactions = unitId
        ? await transactionService.getTransactionsByUnit(unitId)
        : await transactionService.getTransactionsByProperty(propertyId);
      setTransactions(refreshedTransactions);
      setOpen(false);
    } catch (err) {
      setError('Failed to create transaction. Please try again.');
    }
  };

  const handleUpdateTransaction = async (values: any) => {
    try {
      if (selectedTransaction) {
        await transactionService.updateTransaction(selectedTransaction.id, values);
        // Refresh transactions
        const refreshedTransactions = unitId
          ? await transactionService.getTransactionsByUnit(unitId)
          : await transactionService.getTransactionsByProperty(propertyId);
        setTransactions(refreshedTransactions);
        setOpen(false);
      }
    } catch (err) {
      setError('Failed to update transaction. Please try again.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedTransaction) {
        await transactionService.deleteTransaction(selectedTransaction.id);
        // Refresh transactions
        const refreshedTransactions = unitId
          ? await transactionService.getTransactionsByUnit(unitId)
          : await transactionService.getTransactionsByProperty(propertyId);
        setTransactions(refreshedTransactions);
        setDeleteDialogOpen(false);
      }
    } catch (err) {
      setError('Failed to delete transaction. Please try again.');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Transactions
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddTransaction}
        >
          Add Transaction
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {transactions.length === 0 ? (
        <Typography>No transactions found. Click the button above to add a transaction.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>
                    <Chip 
                      icon={transaction.type === TransactionType.Income ? <MoneyIcon /> : <ExpenseIcon />}
                      label={transaction.type === TransactionType.Income ? 'Income' : 'Expense'}
                      color={transaction.type === TransactionType.Income ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{transaction.categoryName}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell align="right">
                    <Typography
                      color={transaction.type === TransactionType.Income ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(transaction.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEditTransaction(transaction)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteTransaction(transaction)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Transaction Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          <TransactionForm
            propertyId={propertyId}
            unitId={unitId}
            initialValues={selectedTransaction || undefined}
            categories={categories}
            onSubmit={isEditing ? handleUpdateTransaction : handleCreateTransaction}
            onCancel={handleClose}
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionManager;