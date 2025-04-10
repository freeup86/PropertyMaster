import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Chip,
  Tooltip
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
  ShowChart as ChartIcon,
  Percent as PercentIcon
} from '@mui/icons-material';
import { PropertyPerformance } from '../../services/financialService';

interface PerformanceMetricsProps {
  performance: PropertyPerformance;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ performance }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const MetricCard = ({ 
    title, 
    value, 
    icon, 
    description, 
    color = 'primary.main', 
    isPercentage = false,
    isCurrency = false 
  }: { 
    title: string, 
    value: number, 
    icon: React.ReactNode, 
    description: string,
    color?: string,
    isPercentage?: boolean,
    isCurrency?: boolean
  }) => (
    <Tooltip title={description} arrow>
      <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" alignItems="center" mb={1}>
          <Box sx={{ color }}>{icon}</Box>
          <Typography variant="subtitle2" color="textSecondary" ml={1}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color }}>
          {isPercentage ? formatPercentage(value) : isCurrency ? formatCurrency(value) : value}
        </Typography>
      </Paper>
    </Tooltip>
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Performance Metrics</Typography>
        <Chip 
          icon={<HomeIcon />} 
          label={performance.propertyName} 
          color="primary" 
          variant="outlined" 
        />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={4} md={3}>
          <MetricCard 
            title="Current Value" 
            value={performance.currentValue} 
            icon={<MoneyIcon />} 
            description="Current estimated value of the property" 
            isCurrency
          />
        </Grid>

        <Grid item xs={6} sm={4} md={3}>
          <MetricCard 
            title="Appreciation" 
            value={performance.appreciationPercentage} 
            icon={<TrendingUpIcon />} 
            description="Total percentage increase in property value since purchase" 
            color={performance.appreciationPercentage >= 0 ? 'success.main' : 'error.main'}
            isPercentage
          />
        </Grid>

        <Grid item xs={6} sm={4} md={3}>
          <MetricCard 
            title="Cap Rate" 
            value={performance.capRate} 
            icon={<PercentIcon />} 
            description="Net operating income as a percentage of property value" 
            color={performance.capRate >= 5 ? 'success.main' : 'warning.main'}
            isPercentage
          />
        </Grid>

        <Grid item xs={6} sm={4} md={3}>
          <MetricCard 
            title="Cash on Cash Return" 
            value={performance.cashOnCashReturn} 
            icon={<ChartIcon />} 
            description="Annual cash flow as a percentage of total cash invested" 
            color={performance.cashOnCashReturn >= 8 ? 'success.main' : 'warning.main'}
            isPercentage
          />
        </Grid>

        <Grid item xs={6} sm={4} md={3}>
          <MetricCard 
            title="Annual Cash Flow" 
            value={performance.annualCashFlow} 
            icon={<MoneyIcon />} 
            description="Yearly net income after all expenses" 
            color={performance.annualCashFlow >= 0 ? 'success.main' : 'error.main'}
            isCurrency
          />
        </Grid>

        <Grid item xs={6} sm={4} md={3}>
          <MetricCard 
            title="Total Return" 
            value={performance.annualizedReturn} 
            icon={<TrendingUpIcon />} 
            description="Annualized return including both cash flow and appreciation" 
            color={performance.annualizedReturn >= 10 ? 'success.main' : 'warning.main'}
            isPercentage
          />
        </Grid>

        <Grid item xs={6} sm={4} md={3}>
          <MetricCard 
            title="Expense Ratio" 
            value={performance.expenseRatio} 
            icon={<TrendingDownIcon />} 
            description="Operating expenses as a percentage of income" 
            color={performance.expenseRatio <= 50 ? 'success.main' : 'warning.main'}
            isPercentage
          />
        </Grid>

        <Grid item xs={6} sm={4} md={3}>
          <MetricCard 
            title="Occupancy Rate" 
            value={performance.occupancyRate} 
            icon={<HomeIcon />} 
            description="Percentage of units currently occupied" 
            color={performance.occupancyRate >= 90 ? 'success.main' : 'warning.main'}
            isPercentage
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PerformanceMetrics;