import React from 'react';
import { PropertyPerformance } from '../../services/financialService'; // Adjust path
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label
} from 'recharts';

interface PropertyValueAppreciationChartProps {
    performance: PropertyPerformance | null;
}

const PropertyValueAppreciationChart: React.FC<PropertyValueAppreciationChartProps> = ({ performance }) => {
    if (!performance) {
        return <div>No Property Value Appreciation data available.</div>;
    }

    // Prepare data (example - you might need to fetch historical data)
    const appreciationData = [
        { year: performance.purchasePrice, value: performance.purchasePrice },
        { year: performance.currentValue, value: performance.currentValue },
        // ... more data points if available
    ];

    return (
        <div>
            <h3>Property Value Appreciation</h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={appreciationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year">
                      <Label value="Value" offset={0} position="bottom" />
                    </XAxis>
                    <YAxis>
                      <Label value="Year" angle={-90} offset={0} position="left" />
                    </YAxis>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Value" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PropertyValueAppreciationChart;