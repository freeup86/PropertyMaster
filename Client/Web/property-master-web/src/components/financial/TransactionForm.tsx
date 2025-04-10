import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Box,
  Typography,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Alert
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Transaction, TransactionType, CreateTransactionRequest, UpdateTransactionRequest } from '../../services/transactionService';
import { Category } from '../../services/categoryService';

interface TransactionFormProps {
  initialValues?: Transaction;
  propertyId: string;
  unitId?: string;
  categories: Category[];
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  initialValues, 
  propertyId,
  unitId,
  categories,
  onSubmit, 
  onCancel,
  isEditing = false 
}) => {
  const initialFormValues = initialValues ? {
    propertyId: initialValues.propertyId,
    unitId: initialValues.unitId || '',
    categoryId: initialValues.categoryId,
    type: initialValues.type,
    date: new Date(initialValues.date),
    amount: initialValues.amount,
    description: initialValues.description || '',
    notes: initialValues.notes || '',
    isRecurring: initialValues.isRecurring,
    isTaxDeductible: initialValues.isTaxDeductible,
    isPaid: initialValues.isPaid
  } : {
    propertyId: propertyId,
    unitId: unitId || '',
    categoryId: '',
    type: TransactionType.Expense,
    date: new Date(),
    amount: 0,
    description: '',
    notes: '',
    isRecurring: false,
    isTaxDeductible: false,
    isPaid: true
  };

  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  
  // Filter categories based on type
  useEffect(() => {
    setIncomeCategories(categories.filter(c => c.type === 'Income'));
    setExpenseCategories(categories.filter(c => c.type === 'Expense'));
  }, [categories]);

  const validationSchema = Yup.object({
    categoryId: Yup.string().required('Category is required'),
    date: Yup.date().required('Date is required'),
    amount: Yup.number().required('Amount is required').min(0.01, 'Amount must be greater than 0'),
    description: Yup.string().max(255, 'Description can be at most 255 characters')
  });

  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    }
  });

  // Handle category display based on transaction type
  const getAvailableCategories = () => {
    return formik.values.type === TransactionType.Income ? incomeCategories : expenseCategories;
  };

  // Reset category when transaction type changes
  useEffect(() => {
    // Only reset if not in edit mode or if there's a mismatch between type and category type
    if (!isEditing || (formik.values.categoryId && categories.length > 0)) {
      const selectedCategory = categories.find(c => c.id === formik.values.categoryId);
      
      if (selectedCategory) {
        const categoryType = selectedCategory.type;
        const transactionType = formik.values.type === TransactionType.Income ? 'Income' : 'Expense';
        
        if (categoryType !== transactionType) {
          formik.setFieldValue('categoryId', '');
        }
      }
    }
  }, [formik.values.type, categories, formik.values.categoryId, isEditing]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">
          {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2 
        }}>
          <Box sx={{ 
            flex: '1 1 300px', 
            minWidth: 250 
          }}>
            <FormControl fullWidth>
              <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
              <Select
                labelId="transaction-type-label"
                id="type"
                name="type"
                value={formik.values.type}
                label="Transaction Type"
                onChange={formik.handleChange}
              >
                <MenuItem value={TransactionType.Income}>Income</MenuItem>
                <MenuItem value={TransactionType.Expense}>Expense</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ 
            flex: '1 1 300px', 
            minWidth: 250 
          }}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="categoryId"
                name="categoryId"
                value={formik.values.categoryId}
                label="Category"
                onChange={formik.handleChange}
                error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
              >
                {getAvailableCategories().length === 0 ? (
                  <MenuItem disabled>No categories available</MenuItem>
                ) : (
                  getAvailableCategories().map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {formik.touched.categoryId && formik.errors.categoryId && (
                <Typography color="error" variant="caption">
                  {formik.errors.categoryId}
                </Typography>
              )}
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2 
        }}>
          <Box sx={{ 
            flex: '1 1 300px', 
            minWidth: 250 
          }}>
            <div className="date-picker-container">
              <label htmlFor="transaction-date">Date</label>
              <DatePicker
                id="transaction-date"
                selected={formik.values.date}
                onChange={(date: Date | null) => {
                  if (date) {
                    formik.setFieldValue('date', date);
                  }
                }}
                className="form-control date-picker"
                dateFormat="MMMM d, yyyy"
              />
              {formik.touched.date && formik.errors.date && (
                <div className="error-text">{formik.errors.date as string}</div>
              )}
            </div>
          </Box>
          
          <Box sx={{ 
            flex: '1 1 300px', 
            minWidth: 250 
          }}>
            <TextField
              fullWidth
              id="amount"
              name="amount"
              label="Amount"
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              value={formik.values.amount}
              onChange={formik.handleChange}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
            />
          </Box>
        </Box>
        
        <TextField
          fullWidth
          id="description"
          name="description"
          label="Description"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />
        
        <TextField
          fullWidth
          id="notes"
          name="notes"
          label="Notes"
          multiline
          rows={3}
          value={formik.values.notes}
          onChange={formik.handleChange}
        />
        
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2 
        }}>
          <Box sx={{ 
            flex: '1 1 200px', 
            minWidth: 150 
          }}>
            <FormControlLabel
              control={
                <Switch
                  id="isTaxDeductible"
                  name="isTaxDeductible"
                  checked={formik.values.isTaxDeductible}
                  onChange={formik.handleChange}
                  color="primary"
                />
              }
              label="Tax Deductible"
            />
          </Box>
          
          <Box sx={{ 
            flex: '1 1 200px', 
            minWidth: 150 
          }}>
            <FormControlLabel
              control={
                <Switch
                  id="isPaid"
                  name="isPaid"
                  checked={formik.values.isPaid}
                  onChange={formik.handleChange}
                  color="primary"
                />
              }
              label="Paid"
            />
          </Box>
          
          <Box sx={{ 
            flex: '1 1 200px', 
            minWidth: 150 
          }}>
            <FormControlLabel
              control={
                <Switch
                  id="isRecurring"
                  name="isRecurring"
                  checked={formik.values.isRecurring}
                  onChange={formik.handleChange}
                  color="primary"
                />
              }
              label="Recurring"
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            {isEditing ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default TransactionForm;