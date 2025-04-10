import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tab, 
  Tabs, 
  CircularProgress,
  Alert,
  Button,
  TextField,
  Grid
} from '@mui/material';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import IncomeExpensesChart from './IncomeExpensesChart';
import CashFlowStatement from './CashFlowStatement';
import PerformanceMetrics from './PerformanceMetrics';
import financialService, { FinancialReport, CashFlowReport, PropertyPerformance } from '../../services/financialService';
import transactionService, { Transaction } from '../../services/transactionService';

interface PropertyFinancialDashboardProps {
  propertyId: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`financial-tabpanel-${index}`}
      aria-labelledby={`financial-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PropertyFinancialDashboard: React.FC<PropertyFinancialDashboardProps> = ({ propertyId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date>(new Date(new Date().getFullYear(), 11, 31));
  const [financialReport, setFinancialReport] = useState<FinancialReport | null>(null);
  const [cashFlowReport, setCashFlowReport] = useState<CashFlowReport | null>(null);
  const [propertyPerformance, setPropertyPerformance] = useState<PropertyPerformance | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState({
    report: true,
    cashFlow: true,
    performance: true,
    transactions: true
  });
  const [error, setError] = useState<string | null>(null);

  // Load financial data based on selected date range
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        // Reset loading states
        setLoading({
          report: true,
          cashFlow: true,
          performance: true,
          transactions: true
        });
        
        // Format dates for API
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        
        // Fetch financial report
        const report = await financialService.getFinancialReport(
          propertyId, 
          formattedStartDate, 
          formattedEndDate
        );
        setFinancialReport(report);
        setLoading(prev => ({ ...prev, report: false }));
        
        // Fetch cash flow report
        const cashFlow = await financialService.getCashFlowReport(propertyId);
        setCashFlowReport(cashFlow);
        setLoading(prev => ({ ...prev, cashFlow: false }));
        
        // Fetch property performance
        const performance = await financialService.getPropertyPerformance(propertyId);
        setPropertyPerformance(performance);
        setLoading(prev => ({ ...prev, performance: false }));
        
        // Fetch recent transactions
        const transactions = await transactionService.getTransactionsByProperty(
          propertyId, 
          formattedStartDate, 
          formattedEndDate
        );
        setRecentTransactions(transactions);
        setLoading(prev => ({ ...prev, transactions: false }));
      } catch (err) {
        setError('Failed to load financial data. Please try again later.');
        setLoading({
          report: false,
          cashFlow: false,
          performance: false,
          transactions: false
        });
      }
    };

    fetchFinancialData();
  }, [propertyId, startDate, endDate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDateRangeChange = () => {
    // This is triggered when applying a new date range
    // Fetching happens in the useEffect when dates change
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading.report && loading.cashFlow && loading.performance && loading.transactions) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Financial Dashboard
        </Typography>
        
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <div className="date-picker-container">
            <label htmlFor="start-date">Start Date</label>
            <DatePicker
              id="start-date"
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              className="form-control date-picker"
              dateFormat="MMMM d, yyyy"
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={4}>
          <div className="date-picker-container">
            <label htmlFor="end-date">End Date</label>
            <DatePicker
              id="end-date"
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              className="form-control date-picker"
              dateFormat="MMMM d, yyyy"
            />
          </div>
        </Grid>
          <Grid item xs={12} sm={4}>
            <Button 
              variant="contained" 
              onClick={handleDateRangeChange}
              fullWidth
            >
              Apply Date Range
            </Button>
          </Grid>
        </Grid>

        {propertyPerformance && (
          <PerformanceMetrics performance={propertyPerformance} />
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="financial tabs"
          >
            <Tab label="Income vs Expenses" id="financial-tab-0" />
            <Tab label="Cash Flow Statement" id="financial-tab-1" />
            <Tab label="Recent Transactions" id="financial-tab-2" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          {financialReport && financialReport.monthlySummary && (
            <IncomeExpensesChart data={financialReport.monthlySummary} />
          )}
          
          {financialReport && (
            <Box mt={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Income
                    </Typography>
                    <Typography variant="h5" color="success.main">
                      {formatCurrency(financialReport.totalIncome)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Expenses
                    </Typography>
                    <Typography variant="h5" color="error.main">
                      {formatCurrency(financialReport.totalExpenses)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Net Operating Income
                    </Typography>
                    <Typography 
                      variant="h5" 
                      color={financialReport.netOperatingIncome >= 0 ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(financialReport.netOperatingIncome)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {cashFlowReport && (
            <CashFlowStatement cashFlow={cashFlowReport} />
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          {recentTransactions.length > 0 ? (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Recent Transactions
              </Typography>
              {recentTransactions.map((transaction) => (
                <Paper key={transaction.id} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Date
                      </Typography>
                      <Typography>
                        {formatDate(transaction.date)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Category
                      </Typography>
                      <Typography>
                        {transaction.categoryName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Description
                      </Typography>
                      <Typography>
                        {transaction.description || 'No description'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Amount
                      </Typography>
                      <Typography 
                        color={transaction.type === 0 ? 'success.main' : 'error.main'}
                        fontWeight="bold"
                      >
                        {transaction.type === 0 ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography>
              No transactions found for the selected date range.
            </Typography>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default PropertyFinancialDashboard;