import React from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Bar,
  BarChart
} from 'recharts';
import { MultiYearTaxComparison } from '../../services/taxReportService';

interface MultiYearComparisonComponentProps {
  comparison: MultiYearTaxComparison | null;
  loading: boolean;
  error: string | null;
}

const MultiYearComparisonComponent: React.FC<MultiYearComparisonComponentProps> = ({ 
  comparison, 
  loading, 
  error 
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!comparison) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No comparison data available. Please select a property and year range.
      </Alert>
    );
  }

  // Prepare chart data
  const chartData = comparison.yearlyData.map(yearData => ({
    year: yearData.year,
    income: yearData.totalIncome,
    expenses: yearData.totalDeductibleExpenses,
    taxable: yearData.taxableIncome
  }));

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Multi-Year Tax Comparison for {comparison.propertyName}
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Income and Expenses Trend</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Line type="monotone" dataKey="income" name="Total Income" stroke="#8884d8" />
            <Line type="monotone" dataKey="expenses" name="Deductible Expenses" stroke="#82ca9d" />
            <Line type="monotone" dataKey="taxable" name="Taxable Income" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Year-over-Year Changes</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparison.yearlyData.filter(data => data.yearOverYearIncomeChange !== 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
            <Legend />
            <Bar dataKey="yearOverYearIncomeChange" name="Income Change %" fill="#8884d8" />
            <Bar dataKey="yearOverYearExpenseChange" name="Expense Change %" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box>
        <Typography variant="h6" gutterBottom>Detailed Comparison</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Year</TableCell>
                <TableCell align="right">Total Income</TableCell>
                <TableCell align="right">Income Change</TableCell>
                <TableCell align="right">Deductible Expenses</TableCell>
                <TableCell align="right">Expense Change</TableCell>
                <TableCell align="right">Taxable Income</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comparison.yearlyData.map((yearData) => (
                <TableRow key={yearData.year}>
                  <TableCell>{yearData.year}</TableCell>
                  <TableCell align="right">{formatCurrency(yearData.totalIncome)}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: yearData.yearOverYearIncomeChange > 0 ? 'success.main' : yearData.yearOverYearIncomeChange < 0 ? 'error.main' : 'inherit'
                    }}
                  >
                    {yearData.yearOverYearIncomeChange === 0 ? '-' : formatPercentage(yearData.yearOverYearIncomeChange)}
                  </TableCell>
                  <TableCell align="right">{formatCurrency(yearData.totalDeductibleExpenses)}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: yearData.yearOverYearExpenseChange < 0 ? 'success.main' : yearData.yearOverYearExpenseChange > 0 ? 'error.main' : 'inherit'
                    }}
                  >
                    {yearData.yearOverYearExpenseChange === 0 ? '-' : formatPercentage(yearData.yearOverYearExpenseChange)}
                  </TableCell>
                  <TableCell align="right">{formatCurrency(yearData.taxableIncome)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default MultiYearComparisonComponent;