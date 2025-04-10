import React from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import { CashFlowReport } from '../../services/financialService';

interface CashFlowStatementProps {
  cashFlow: CashFlowReport;
}

const CashFlowStatement: React.FC<CashFlowStatementProps> = ({ cashFlow }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Monthly Cash Flow Statement
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Income Section */}
            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant="subtitle2">Income</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Rental Income</TableCell>
              <TableCell align="right">{formatCurrency(cashFlow.monthlyRentalIncome)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Other Income</TableCell>
              <TableCell align="right">{formatCurrency(cashFlow.otherMonthlyIncome)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Income</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(cashFlow.totalMonthlyIncome)}
              </TableCell>
            </TableRow>

            {/* Expenses Section */}
            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant="subtitle2">Operating Expenses</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Vacancy Loss</TableCell>
              <TableCell align="right">{formatCurrency(cashFlow.vacancyLoss)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Property Management</TableCell>
              <TableCell align="right">{formatCurrency(cashFlow.propertyManagement)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Property Taxes</TableCell>
              <TableCell align="right">{formatCurrency(cashFlow.propertyTax)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Insurance</TableCell>
              <TableCell align="right">{formatCurrency(cashFlow.insurance)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Maintenance</TableCell>
              <TableCell align="right">{formatCurrency(cashFlow.maintenance)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Utilities</TableCell>
              <TableCell align="right">{formatCurrency(cashFlow.utilities)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Other Expenses</TableCell>
              <TableCell align="right">{formatCurrency(cashFlow.otherExpenses)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Operating Expenses</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(cashFlow.totalOperatingExpenses)}
              </TableCell>
            </TableRow>

            {/* NOI Section */}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Net Operating Income (NOI)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(cashFlow.netOperatingIncome)}
              </TableCell>
            </TableRow>

            {/* Financing Section */}
            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant="subtitle2">Financing Costs</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Mortgage Payment</TableCell>
              <TableCell align="right">{formatCurrency(cashFlow.mortgagePayment)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Other Financing Costs</TableCell>
              <TableCell align="right">{formatCurrency(cashFlow.otherFinancingCosts)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Financing Costs</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(cashFlow.totalFinancingCosts)}
              </TableCell>
            </TableRow>

            {/* Cash Flow Section */}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Monthly Cash Flow</TableCell>
              <TableCell align="right" sx={{ 
                fontWeight: 'bold',
                color: cashFlow.monthlyCashFlow >= 0 ? 'success.main' : 'error.main'
              }}>
                {formatCurrency(cashFlow.monthlyCashFlow)}
              </TableCell>
            </TableRow>

            {/* Annual Section */}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Annual Cash Flow</TableCell>
              <TableCell align="right" sx={{ 
                fontWeight: 'bold',
                color: cashFlow.annualCashFlow >= 0 ? 'success.main' : 'error.main'
              }}>
                {formatCurrency(cashFlow.annualCashFlow)}
              </TableCell>
            </TableRow>

            {/* Performance Metrics */}
            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant="subtitle2">Performance Metrics</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Cash on Cash Return</TableCell>
              <TableCell align="right">{formatPercentage(cashFlow.cashOnCashReturn)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ pl: 4 }}>Cap Rate</TableCell>
              <TableCell align="right">{formatPercentage(cashFlow.capRate)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CashFlowStatement;