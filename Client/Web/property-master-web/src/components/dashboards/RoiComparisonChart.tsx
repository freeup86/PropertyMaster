import React from 'react';
import { PropertyPerformance } from '../../services/financialService'; // Adjust path
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

interface RoiComparisonChartProps {
    performance: PropertyPerformance[] | null; // Or an array of PropertyPerformance
}

const RoiComparisonChart: React.FC<RoiComparisonChartProps> = ({ performance }) => {
    if (!performance || performance.length === 0) {
        return <div>No ROI Comparison data available.</div>;
    }

    // Prepare data for the chart
    const roiData = performance.map((p: PropertyPerformance) => ({ // Explicitly type 'p'
        name: p.propertyName,
        roi: p.ROI,
    }));

    return (
        <div>
            <h3>ROI Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={roiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name">
                        <Label value="Property" offset={0} position="bottom" />
                    </XAxis>
                    <YAxis>
                        <Label value="ROI (%)" angle={-90} offset={0} position="left" />
                    </YAxis>
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="roi" fill="#82ca9d" name="ROI" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RoiComparisonChart;