import React, { useState } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  FormControl,
  InputLabel,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
  InputAdornment
} from '@mui/material';
import { 
  ReceiptOutlined as TaxIcon,
  Calculate as CalculateIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as DeductionIcon,
  Savings as SavingsIcon
} from '@mui/icons-material';
import { TaxEstimation, TaxEstimationRequest } from '../../services/taxReportService';

interface TaxEstimationComponentProps {
  propertyId: string;
  taxYear: number;
  onEstimateTaxes: (request: TaxEstimationRequest) => Promise<void>;
  estimation: TaxEstimation | null;
  loading: boolean;
  error: string | null;
}

const TaxEstimationComponent: React.FC<TaxEstimationComponentProps> = ({ 
  propertyId,
  taxYear,
  onEstimateTaxes,
  estimation,
  loading,
  error
}) => {
  const [taxRate, setTaxRate] = useState<number>(25);
  const [additionalIncome, setAdditionalIncome] = useState<number>(0);
  const [additionalDeductions, setAdditionalDeductions] = useState<number>(0);

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTaxRate(isNaN(value) ? 0 : Math.min(Math.max(value, 0), 100));
  };

  const handleAdditionalIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAdditionalIncome(isNaN(value) ? 0 : Math.max(value, 0));
  };

  const handleAdditionalDeductionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAdditionalDeductions(isNaN(value) ? 0 : Math.max(value, 0));
  };

  const handleEstimate = () => {
    const request: TaxEstimationRequest = {
      propertyId,
      taxYear,
      taxRate,
      additionalIncome,
      additionalDeductions
    };
    onEstimateTaxes(request);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TaxIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Tax Estimation Tool</Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Estimate your tax liability by adjusting income, deductions, and tax rate.
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
          <FormControl fullWidth>
            <TextField
              label="Tax Rate (%)"
              type="number"
              value={taxRate}
              onChange={handleTaxRateChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              inputProps={{ min: 0, max: 100, step: 0.1 }}
            />
          </FormControl>
        </Box>
        
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <FormControl fullWidth>
            <TextField
              label="Additional Income"
              type="number"
              value={additionalIncome}
              onChange={handleAdditionalIncomeChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ min: 0, step: 100 }}
            />
          </FormControl>
        </Box>
        
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <FormControl fullWidth>
            <TextField
              label="Additional Deductions"
              type="number"
              value={additionalDeductions}
              onChange={handleAdditionalDeductionsChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ min: 0, step: 100 }}
            />
          </FormControl>
        </Box>
        
        <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<CalculateIcon />}
            onClick={handleEstimate}
            disabled={loading}
          >
            Estimate
          </Button>
        </Box>
      </Box>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress size={32} />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {estimation && (
        <>
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Tax Estimation Results
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
            <Paper 
              elevation={2} 
              sx={{ 
                flex: '1 1 auto', 
                minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33% - 16px)' },
                p: 2,
                bgcolor: 'primary.light',
                color: 'primary.contrastText'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TaxIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Estimated Tax</Typography>
              </Box>
              <Typography variant="h5">
                {formatCurrency(estimation.estimatedTaxLiability)}
              </Typography>
              <Typography variant="caption">
                Based on {estimation.taxRate}% tax rate
              </Typography>
            </Paper>
            
            <Paper 
              elevation={2} 
              sx={{ 
                flex: '1 1 auto', 
                minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33% - 16px)' },
                p: 2,
                bgcolor: 'secondary.light',
                color: 'secondary.contrastText'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IncomeIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Taxable Income</Typography>
              </Box>
              <Typography variant="h5">
                {formatCurrency(estimation.estimatedTaxableIncome)}
              </Typography>
              <Typography variant="caption">
                Including additional income and deductions
              </Typography>
            </Paper>
            
            <Paper 
              elevation={2} 
              sx={{ 
                flex: '1 1 auto', 
                minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33% - 16px)' },
                p: 2,
                bgcolor: estimation.projectedSavings > 0 ? 'success.light' : 'error.light',
                color: estimation.projectedSavings > 0 ? 'success.contrastText' : 'error.contrastText'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SavingsIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Projected Savings</Typography>
              </Box>
              <Typography variant="h5">
                {formatCurrency(Math.abs(estimation.projectedSavings))}
              </Typography>
              <Typography variant="caption">
                {estimation.projectedSavings > 0 ? 'Savings vs. current' : 'Additional cost vs. current'}
              </Typography>
            </Paper>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="textSecondary" paragraph>
              The current taxable income for {estimation.propertyName} in {estimation.taxYear} is {formatCurrency(estimation.currentTaxableIncome)}.
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              With additional income of {formatCurrency(estimation.additionalIncome)} and additional deductions of {formatCurrency(estimation.additionalDeductions)}, 
              your estimated taxable income is {formatCurrency(estimation.estimatedTaxableIncome)}.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Based on a tax rate of {estimation.taxRate}%, your estimated tax liability is {formatCurrency(estimation.estimatedTaxLiability)}.
            </Typography>
            {estimation.projectedSavings !== 0 && (
              <Typography variant="body2" mt={1} fontWeight="bold" color={estimation.projectedSavings > 0 ? "success.main" : "error.main"}>
                This represents a {estimation.projectedSavings > 0 ? "savings" : "cost increase"} of {formatCurrency(Math.abs(estimation.projectedSavings))} compared to your current tax situation.
              </Typography>
            )}
          </Box>
          
          <Box>
            <Alert severity="info">
              This is an estimation tool and does not constitute tax advice. Please consult with a tax professional for accurate tax planning and advice.
            </Alert>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default TaxEstimationComponent;