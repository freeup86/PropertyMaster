import React, { useState, useEffect } from 'react'; // Corrected import!
import { useParams } from 'react-router-dom';
import financialService, { FinancialReport, PropertyPerformance } from '../../services/financialService';
import FinancialSummaryComponent from './FinancialSummaryComponent';
import IncomeVsExpensesChart from './IncomeVsExpensesChart';
import CashFlowProjectionChart from './CashFlowProjectionChart';
import PropertyValueAppreciationChart from './PropertyValueAppreciationChart';
import RoiComparisonChart from './RoiComparisonChart';
import { authService } from '../../services/authService';

const FinancialDashboard: React.FC = () => {
    const { propertyId } = useParams<{ propertyId: string }>();
    const [report, setReport] = useState<FinancialReport[] | null>(null);
    const [performance, setPerformance] = useState<PropertyPerformance[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                if (propertyId) {
                    console.log("FinancialDashboard: Fetching data for propertyId:", propertyId);
                    const reportData = await financialService.getFinancialReport(propertyId);
                    console.log("FinancialDashboard: getFinancialReport response:", reportData);
                    setReport([reportData]);
                    const performanceData = await financialService.getPropertyPerformance(propertyId);
                    console.log("FinancialDashboard: getPropertyPerformance response:", performanceData);
                    setPerformance([performanceData]);
                } else {
                    console.log("FinancialDashboard: No propertyId, fetching general dashboard data");
                    const userId = authService.getCurrentUser()?.userId;
                    if (userId) {
                        const reportData = await financialService.getGeneralFinancialReport(userId);
                        console.log("FinancialDashboard: getGeneralFinancialReport response:", reportData);
                        setReport(reportData);
                        const performanceData = await financialService.getGeneralPropertyPerformance(userId);
                        console.log("FinancialDashboard: getGeneralPropertyPerformance response:", performanceData);
                        setPerformance(performanceData);
                    } else {
                        setError("Could not get user ID for general dashboard.");
                    }
                }
            } catch (err: any) {
                console.error("FinancialDashboard: Error fetching data:", err);
                setError(err.message || "Could not fetch data.");
            } finally {
                setLoading(false);
                console.log("FinancialDashboard: fetchData completed. report:", report, "performance:", performance);
            }
        };

        fetchData();
    }, [propertyId]);

    console.log("FinancialDashboard: Rendering. loading:", loading, "error:", error, "report:", report, "performance:", performance);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!report || !performance) {
        return <div>No data available.</div>;
    }

    return (
        <div>
            <h1>Financial Dashboard</h1>

            {report &&
                report.map((r) => (
                    <FinancialSummaryComponent
                        key={r.propertyId}
                        report={r}
                        performance={
                            performance?.find((p) => p.propertyId === r.propertyId) || null
                        }
                    />
                ))}

            {report && report.map((r) => <IncomeVsExpensesChart key={r.propertyId} report={r} />)}
            {performance &&
                performance.map((p) => (
                    <PropertyValueAppreciationChart key={p.propertyId} performance={p} />
                ))}
            {performance && performance.length > 0 && <RoiComparisonChart performance={performance} />}
        </div>
    );
};

export default FinancialDashboard;