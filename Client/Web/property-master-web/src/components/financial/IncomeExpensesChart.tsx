import React from 'react';
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
import { MonthlyFinancialSummary } from '../../services/financialService';

interface IncomeExpensesChartProps {
  data: MonthlyFinancialSummary[];
}

const IncomeExpensesChart: React.FC<IncomeExpensesChartProps> = ({ data }) => {
  // Transform month numbers to month names
  const formattedData = data.map(item => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return {
      ...item,
      month: `${monthNames[item.month - 1]} ${item.year}`,
      Income: item.income,
      Expenses: item.expenses,
      'Net Income': item.netOperatingIncome
    };
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0 }}><strong>{label}</strong></p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ 
              margin: '5px 0 0', 
              color: entry.color 
            }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={formattedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 70,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month" 
          angle={-45} 
          textAnchor="end" 
          height={70} 
        />
        <YAxis 
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="Income" fill="#4caf50" name="Income" />
        <Bar dataKey="Expenses" fill="#f44336" name="Expenses" />
        <Bar dataKey="Net Income" fill="#2196f3" name="Net Income" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default IncomeExpensesChart;