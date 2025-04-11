// src/components/dashboard/IncomeExpenseChart.tsx
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { FinancialReport } from '../../services/financialService';

interface IncomeExpenseChartProps {
  financialData: FinancialReport[];
}

const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ financialData }) => {
  // Prepare data for chart
  const chartData = financialData.map(report => ({
    name: report.propertyName,
    Income: report.totalIncome,
    Expenses: report.totalExpenses,
    NetIncome: report.totalIncome - report.totalExpenses
  }));

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
      <Typography variant="h6" gutterBottom>Income vs Expenses</Typography>
      
      {chartData.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="body1" color="text.secondary">
            No financial data available
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
            />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
            />
            <Legend />
            <Bar dataKey="Income" fill="#4caf50" name="Income" />
            <Bar dataKey="Expenses" fill="#f44336" name="Expenses" />
            <Bar dataKey="NetIncome" fill="#2196f3" name="Net Income" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default IncomeExpenseChart;