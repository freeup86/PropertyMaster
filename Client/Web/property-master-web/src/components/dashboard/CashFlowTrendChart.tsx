// src/components/dashboard/CashFlowTrendChart.tsx
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { FinancialReport } from '../../services/financialService';

interface CashFlowTrendChartProps {
  financialData: FinancialReport[];
}

const CashFlowTrendChart: React.FC<CashFlowTrendChartProps> = ({ financialData }) => {
  // Prepare data for chart
  // We'll aggregate data by month across all properties
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize monthly data
  const monthlyData = monthNames.map((month, index) => ({
    name: month,
    month: index + 1,
    income: 0,
    expenses: 0,
    cashFlow: 0
  }));
  
  // Aggregate data from all properties
  financialData.forEach(report => {
    report.monthlySummary.forEach(month => {
      const monthIndex = month.month - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex].income += month.income;
        monthlyData[monthIndex].expenses += month.expenses;
        monthlyData[monthIndex].cashFlow += month.cashFlow;
      }
    });
  });
  
  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>Cash Flow Trends</Typography>
      
      {financialData.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="body1" color="text.secondary">
            No financial data available
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              name="Income" 
              stroke="#4caf50" 
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              name="Expenses" 
              stroke="#f44336" 
            />
            <Line 
              type="monotone" 
              dataKey="cashFlow" 
              name="Cash Flow" 
              stroke="#2196f3" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default CashFlowTrendChart;