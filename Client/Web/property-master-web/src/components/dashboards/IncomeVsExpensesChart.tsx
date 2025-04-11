import React from 'react';
import { FinancialReport } from '../../services/financialService'; // Adjust path if needed
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label
} from 'recharts';

interface IncomeVsExpensesChartProps {
    report: FinancialReport | null;
}

const IncomeVsExpensesChart: React.FC<IncomeVsExpensesChartProps> = ({ report }) => {
    if (!report || !report.monthlySummary || report.monthlySummary.length === 0) {
        return <div>No Income vs. Expenses data available.</div>; // Or a more informative message
    }

    // Prepare data for Recharts (ensure month is a string)
    const chartData = report.monthlySummary.map(item => ({
        ...item,
        month: `<span class="math-inline">\{item\.year\}\-</span>{item.month.toString().padStart(2, '0')}`, // "YYYY-MM"
    }));

    return (
        <div>
            <h3>Income vs. Expenses</h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" >
                      <Label value="Month" offset={0} position="bottom" />
                    </XAxis>
                    <YAxis>
                      <Label value="Amount" angle={-90} offset={0} position="left" />
                    </YAxis>
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#82ca9d" name="Income" />
                    <Bar dataKey="expenses" fill="#e06c75" name="Expenses" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IncomeVsExpensesChart;