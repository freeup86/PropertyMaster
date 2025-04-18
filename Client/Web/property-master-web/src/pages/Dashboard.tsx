// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import PropertySummaryCard from '../components/dashboard/PropertySummaryCard';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import OccupancyRateChart from '../components/dashboard/OccupancyRateChart';
import CashFlowTrendChart from '../components/dashboard/CashFlowTrendChart';
import PerformanceComparisonChart from '../components/dashboard/PerformanceComparisonChart';
import propertyService, { Property } from '../services/propertyService';
import financialService, { FinancialReport, PropertyPerformance } from '../services/financialService';
import TaxSummaryCard from '../components/dashboard/TaxSummaryCard';

const Dashboard: React.FC = () => {
  // Properly type the state variables
  const [properties, setProperties] = useState<Property[]>([]);
  const [financialData, setFinancialData] = useState<FinancialReport[]>([]);
  const [performance, setPerformance] = useState<PropertyPerformance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch properties
        const propertiesData = await propertyService.getProperties();
        setProperties(propertiesData);

        // Fetch financial data for each property
        if (propertiesData.length > 0) {
          const startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
          const endDate = new Date().toISOString().split('T')[0];
          
          const financialPromises = propertiesData.map(property => 
            financialService.getFinancialReport(property.id, startDate, endDate)
          );
          
          const performancePromises = propertiesData.map(property => 
            financialService.getPropertyPerformance(property.id)
          );
          
          const financialResults = await Promise.all(financialPromises);
          const performanceResults = await Promise.all(performancePromises);
          
          setFinancialData(financialResults);
          setPerformance(performanceResults);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Calculate summary data
  const totalProperties = properties.length;
  const totalUnits = properties.reduce((sum, property) => sum + property.unitCount, 0);
  const totalValue = properties.reduce((sum, property) => sum + property.currentValue, 0);
  const totalIncome = financialData.reduce((sum, report) => sum + report.totalIncome, 0);
  const totalExpenses = financialData.reduce((sum, report) => sum + report.totalExpenses, 0);
  const netCashFlow = totalIncome - totalExpenses;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      {/* Summary Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3,
        mb: 3 
      }}>
        <Box sx={{ flex: '1 1 200px', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <PropertySummaryCard 
            title="Properties" 
            value={totalProperties} 
            icon="property" 
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <PropertySummaryCard 
            title="Units" 
            value={totalUnits} 
            icon="unit" 
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <PropertySummaryCard 
            title="Portfolio Value" 
            value={totalValue} 
            icon="money" 
            isCurrency
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <PropertySummaryCard 
            title="Net Cash Flow" 
            value={netCashFlow} 
            icon="cashflow" 
            isCurrency
            color={netCashFlow >= 0 ? "success" : "error"}
          />
        </Box>
      </Box>
      
      {/* Charts */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 400px', minWidth: { xs: '100%', md: 'calc(50% - 12px)' } }}>
          <IncomeExpenseChart financialData={financialData} />
        </Box>
        <Box sx={{ flex: '1 1 400px', minWidth: { xs: '100%', md: 'calc(50% - 12px)' } }}>
          <OccupancyRateChart properties={properties} />
        </Box>
        <Box sx={{ width: '100%', mt: 3 }}>
          <CashFlowTrendChart financialData={financialData} />
        </Box>
        <Box sx={{ width: '100%', mt: 3 }}>
          <PerformanceComparisonChart properties={properties} performance={performance} />
        </Box>
        <Box sx={{ flex: '1 1 400px', minWidth: { xs: '100%', md: 'calc(50% - 12px)' } }}>
          <TaxSummaryCard />
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;