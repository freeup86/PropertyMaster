import React from 'react';
  import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
  import { PropertyPerformance } from '../services/financialService';

  interface PerformanceComparisonChartProps {
    data: PropertyPerformance[];
  }

  const PerformanceComparisonChart: React.FC<PerformanceComparisonChartProps> = ({ data }) => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="propertyName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cashOnCashReturn" name="Cash on Cash Return" fill="#8884d8" />
          <Bar dataKey="annualizedReturn" name="Annualized Return" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  export default PerformanceComparisonChart;