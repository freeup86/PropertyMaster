// src/components/dashboard/PerformanceComparisonChart.tsx
import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent 
} from '@mui/material';
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
import { Property } from '../../services/propertyService';
import { PropertyPerformance } from '../../services/financialService';

interface PerformanceComparisonChartProps {
  properties: Property[];
  performance: PropertyPerformance[];
}

const PerformanceComparisonChart: React.FC<PerformanceComparisonChartProps> = ({ 
  properties, 
  performance 
}) => {
  const [metric, setMetric] = useState<string>('cashOnCashReturn');
  
  const handleMetricChange = (event: SelectChangeEvent) => {
    setMetric(event.target.value);
  };
  
  // Prepare data for chart
  const chartData = properties.map(property => {
    const performanceData = performance.find(p => p.propertyId === property.id);
    
    return {
      name: property.name,
      propertyId: property.id,
      cashOnCashReturn: performanceData?.cashOnCashReturn || 0,
      capRate: performanceData?.capRate || 0,
      appreciationPercentage: performanceData?.appreciationPercentage || 0,
      annualizedReturn: performanceData?.annualizedReturn || 0,
      occupancyRate: performanceData?.occupancyRate || 0
    };
  });
  
  // Define metric options
  const metricOptions = [
    { value: 'cashOnCashReturn', label: 'Cash on Cash Return (%)' },
    { value: 'capRate', label: 'Cap Rate (%)' },
    { value: 'appreciationPercentage', label: 'Appreciation (%)' },
    { value: 'annualizedReturn', label: 'Annualized Return (%)' },
    { value: 'occupancyRate', label: 'Occupancy Rate (%)' }
  ];
  
  // Get selected metric info
  const selectedMetric = metricOptions.find(option => option.value === metric);
  
  // Format percentage for tooltip
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };
  
  // Get bar color based on metric
  const getBarColor = () => {
    switch (metric) {
      case 'cashOnCashReturn':
        return '#9c27b0'; // Purple
      case 'capRate':
        return '#ff9800'; // Orange
      case 'appreciationPercentage':
        return '#2196f3'; // Blue
      case 'annualizedReturn':
        return '#4caf50'; // Green
      case 'occupancyRate':
        return '#e91e63'; // Pink
      default:
        return '#2196f3'; // Default blue
    }
  };

  return (
    <Paper sx={{ p: 2, height: 500, display: 'flex', flexDirection: 'column' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Property Performance Comparison</Typography>
        
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel id="performance-metric-label">Performance Metric</InputLabel>
          <Select
            labelId="performance-metric-label"
            id="performance-metric"
            value={metric}
            label="Performance Metric"
            onChange={handleMetricChange}
          >
            {metricOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {chartData.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="body1" color="text.secondary">
            No performance data available
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
            <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
            <Tooltip formatter={(value) => formatPercentage(Number(value))} />
            <Legend />
            <Bar 
              dataKey={metric} 
              name={selectedMetric?.label || ''} 
              fill={getBarColor()} 
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default PerformanceComparisonChart;