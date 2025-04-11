import React from 'react';
import { FinancialReport, PropertyPerformance } from '../../services/financialService'; // Adjust path if needed

interface FinancialSummaryProps {
    report: FinancialReport | null;
    performance: PropertyPerformance | null;
}

const FinancialSummaryComponent: React.FC<FinancialSummaryProps> = ({ report, performance }) => {
    if (!report || !performance) {
        return <div>Loading Financial Summary...</div>; // Or a more appropriate message
    }

    return (
        <div>
            <h2>Financial Summary</h2>
            <p>Current Month Income: ${report.totalIncome?.toFixed(2) || '0.00'}</p>
            <p>Current Month Expenses: ${report.totalExpenses?.toFixed(2) || '0.00'}</p>
            <p>Net Operating Income: ${report.netOperatingIncome?.toFixed(2) || '0.00'}</p>
            <p>Cash Flow: ${report.cashFlow?.toFixed(2) || '0.00'}</p>
            <p>Expense Ratio: {report.expenseRatio?.toFixed(2) || '0.00'}%</p>
            {performance && <p>ROI: {performance.ROI?.toFixed(2) || '0.00'}%</p>}
            {/* ... other metrics you want to display */}
        </div>
    );
};

export default FinancialSummaryComponent;