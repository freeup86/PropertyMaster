import React from 'react';
import { FinancialReport } from '../../services/financialService'; // Adjust path if needed
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
} from 'recharts';

interface CashFlowProjectionChartProps {
    report: FinancialReport | null;
}

const CashFlowProjectionChart: React.FC<CashFlowProjectionChartProps> = ({ report }) => {
    if (!report || !report.monthlySummary || report.monthlySummary.length === 0) {
        return <div>No Cash Flow Projection data available.</div>;
    }

    // Prepare data (assuming cashFlow is already in monthlySummary)
    const chartData = report.monthlySummary.map(item => ({
        ...item,
        month: `<span class="math-inline">\{item\.year\}\-</span>{item.month.toString().padStart(2, '0')}`,
    }));

    return (
        <div>
            <h3>Cash Flow Projection</h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month">
                      <Label value="Month" offset={0} position="bottom" />
                    </XAxis>
                    <YAxis>
                      <Label value="Cash Flow" angle={-90} offset={0} position="left" />
                    </YAxis>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cashFlow" stroke="#8884d8" name="Cash Flow" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CashFlowProjectionChart;