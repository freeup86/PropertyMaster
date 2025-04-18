import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  CircularProgress,
  Divider,
  Button
} from '@mui/material';
import { ReceiptOutlined as TaxIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import taxReportService, { TaxReport } from '../../services/taxReportService';

const TaxSummaryCard: React.FC = () => {
  const [taxReports, setTaxReports] = useState<TaxReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  useEffect(() => {
    const fetchTaxReports = async () => {
      setLoading(true);
      try {
        const reports = await taxReportService.getAllPropertiesTaxReport(lastYear);
        setTaxReports(reports);
        setError(null);
      } catch (err) {
        setError('Failed to load tax data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxReports();
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Calculate total taxable income across all properties
  const totalTaxableIncome = taxReports.reduce((sum, report) => sum + report.taxableIncome, 0);
  // Calculate total deductible expenses across all properties
  const totalDeductibleExpenses = taxReports.reduce((sum, report) => sum + report.totalDeductibleExpenses, 0);

  const handleViewReports = () => {
    navigate('/tax-reports');
  };

  return (
    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TaxIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Tax Summary {lastYear}</Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <CircularProgress size={24} />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="textSecondary">Properties:</Typography>
              <Typography variant="body1">{taxReports.length}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="textSecondary">Total Taxable Income:</Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatCurrency(totalTaxableIncome)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="textSecondary">Total Deductible Expenses:</Typography>
              <Typography variant="body1" color="success.main" fontWeight="bold">
                {formatCurrency(totalDeductibleExpenses)}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Properties with highest taxable income:
            </Typography>
            
            {taxReports
              .sort((a, b) => b.taxableIncome - a.taxableIncome)
              .slice(0, 3)
              .map((report) => (
                <Box key={report.propertyId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" noWrap sx={{ maxWidth: '60%' }}>
                    {report.propertyName}:
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(report.taxableIncome)}
                  </Typography>
                </Box>
              ))}
          </Box>
          
          <Button 
            variant="outlined" 
            color="primary"
            onClick={handleViewReports}
            sx={{ mt: 2 }}
          >
            View Full Tax Reports
          </Button>
        </>
      )}
    </Paper>
  );
};

export default TaxSummaryCard;