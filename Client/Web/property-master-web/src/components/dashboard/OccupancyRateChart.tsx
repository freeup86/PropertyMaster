// src/components/dashboard/OccupancyRateChart.tsx
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Property } from '../../services/propertyService';

interface OccupancyRateChartProps {
  properties: Property[];
}

const OccupancyRateChart: React.FC<OccupancyRateChartProps> = ({ properties }) => {
  // Calculate total units and occupied units
  const totalUnits = properties.reduce((sum, property) => sum + property.unitCount, 0);
  let occupiedUnits = 0;
  
  // This is an approximation since we don't have direct access to unit occupancy data
  // In a real implementation, you would fetch this data from your API
  properties.forEach(property => {
    // Assume 80% occupancy rate for demonstration
    occupiedUnits += Math.round(property.unitCount * 0.8);
  });
  
  // Calculate vacancy
  const vacantUnits = totalUnits - occupiedUnits;
  
  // Prepare data for chart
  const chartData = [
    { name: 'Occupied', value: occupiedUnits },
    { name: 'Vacant', value: vacantUnits }
  ];
  
  // Colors for the pie chart
  const COLORS = ['#4caf50', '#f44336'];
  
  // Calculate occupancy rate percentage
  const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

  return (
    <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>Occupancy Rate</Typography>
      
      {totalUnits === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="body1" color="text.secondary">
            No unit data available
          </Typography>
        </Box>
      ) : (
        <>
          <Box display="flex" justifyContent="center" mb={2}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {occupancyRate.toFixed(1)}%
            </Typography>
          </Box>
          
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Units']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}
    </Paper>
  );
};

export default OccupancyRateChart;