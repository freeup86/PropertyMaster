import React, { useState } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Button, 
  CircularProgress,
  Alert,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Calculate as CalculateIcon,
  BarChart as ChartIcon
} from '@mui/icons-material';
import { 
  TaxBracket, 
  TaxBracketCalculation, 
  TaxBracketCalculationRequest 
} from '../../services/taxReportService';

interface TaxBracketComponentProps {
  propertyId: string;
  taxYear: number;
  onCalculateTaxes: (request: TaxBracketCalculationRequest) => Promise<void>;
  calculation: TaxBracketCalculation | null;
  loading: boolean;
  error: string | null;
}

const TaxBracketComponent: React.FC<TaxBracketComponentProps> = ({ 
  propertyId,
  taxYear,
  onCalculateTaxes,
  calculation,
  loading,
  error
}) => {
  console.log('TaxBracketComponent Rendering:', { propertyId, taxYear, calculation, loading, error });
  
  // Default brackets (example: 2023 US federal income tax brackets for single filers)
  const defaultBrackets: TaxBracket[] = [
    { lowerBound: 0, upperBound: 10275, rate: 10 },
    { lowerBound: 10275, upperBound: 41775, rate: 12 },
    { lowerBound: 41775, upperBound: 89075, rate: 22 },
    { lowerBound: 89075, upperBound: 170050, rate: 24 },
    { lowerBound: 170050, upperBound: 215950, rate: 32 },
    { lowerBound: 215950, upperBound: 539900, rate: 35 },
    { lowerBound: 539900, upperBound: 1000000000, rate: 37 }
  ];

  const [brackets, setBrackets] = useState<TaxBracket[]>(defaultBrackets);
  const [additionalIncome, setAdditionalIncome] = useState<number>(0);
  const [additionalDeductions, setAdditionalDeductions] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddBracket = () => {
    const lastBracket = brackets[brackets.length - 1];
    const newBracket = {
      lowerBound: lastBracket.upperBound,
      upperBound: lastBracket.upperBound + 50000,
      rate: lastBracket.rate
    };
    setBrackets([...brackets, newBracket]);
  };

  const handleRemoveBracket = (index: number) => {
    if (brackets.length <= 1) {
      setValidationError("You must have at least one tax bracket");
      return;
    }
    
    const newBrackets = [...brackets];
    newBrackets.splice(index, 1);
    
    // If we remove a bracket in the middle, we need to update the next bracket's lower bound
    if (index < newBrackets.length) {
      newBrackets[index].lowerBound = index > 0 ? newBrackets[index - 1].upperBound : 0;
    }
    
    setBrackets(newBrackets);
    setValidationError(null);
  };

  const handleBracketChange = (index: number, field: keyof TaxBracket, value: number) => {
    const newBrackets = [...brackets];
    newBrackets[index] = { ...newBrackets[index], [field]: value };
    
    // Validate bracket integrity
    try {
      validateBrackets(newBrackets);
      setValidationError(null);
      setBrackets(newBrackets);
    } catch (error) {
      setValidationError((error as Error).message);
    }
  };

  const validateBrackets = (bracketsToValidate: TaxBracket[]) => {
    // Check if brackets are in ascending order
    for (let i = 0; i < bracketsToValidate.length; i++) {
      const bracket = bracketsToValidate[i];
      
      // Lower bound must be less than upper bound
      if (bracket.lowerBound >= bracket.upperBound) {
        throw new Error(`Bracket ${i+1}: Lower bound must be less than upper bound`);
      }
      
      // Check if brackets are contiguous
      if (i > 0 && bracket.lowerBound !== bracketsToValidate[i-1].upperBound) {
        throw new Error(`Bracket ${i+1}: Lower bound must equal previous bracket's upper bound`);
      }
      
      // First bracket should start at 0
      if (i === 0 && bracket.lowerBound !== 0) {
        throw new Error("First bracket must start at 0");
      }
      
      // Tax rate must be between 0 and 100
      if (bracket.rate < 0 || bracket.rate > 100) {
        throw new Error(`Bracket ${i+1}: Tax rate must be between 0 and 100%`);
      }
    }
  };

  const handleCalculate = () => {
    try {
      validateBrackets(brackets);
      
      const request: TaxBracketCalculationRequest = {
        propertyId,
        taxYear,
        brackets,
        additionalIncome,
        additionalDeductions
      };
      
      onCalculateTaxes(request);
      setValidationError(null);
    } catch (error) {
      setValidationError((error as Error).message);
    }
  };

  const handleResetToDefault = () => {
    setBrackets(defaultBrackets);
    setValidationError(null);
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
        <ChartIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Tax Bracket Calculator</Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Define your tax brackets to calculate detailed tax liability based on progressive tax rates.
        </Typography>
      </Box>
      
      {validationError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {validationError}
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1">Tax Brackets</Typography>
          <Box>
            <Button 
              size="small" 
              startIcon={<AddIcon />}
              onClick={handleAddBracket}
              sx={{ mr: 1 }}
            >
              Add Bracket
            </Button>
            <Button 
              size="small"
              onClick={handleResetToDefault}
              color="secondary"
            >
              Reset
            </Button>
          </Box>
        </Box>
        
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Rate (%)</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {brackets.map((bracket, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={bracket.lowerBound}
                      onChange={(e) => handleBracketChange(index, 'lowerBound', parseFloat(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        readOnly: index === 0 || index > 0, // Only first bracket's lower bound is fixed at 0
                      }}
                      sx={{ width: '130px' }}
                      disabled={index === 0 || index > 0} // First bracket starts at 0, and other brackets' lower bounds are determined by previous bracket's upper bound
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={bracket.upperBound}
                      onChange={(e) => handleBracketChange(index, 'upperBound', parseFloat(e.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{ width: '130px' }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={bracket.rate}
                      onChange={(e) => handleBracketChange(index, 'rate', parseFloat(e.target.value))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                      sx={{ width: '100px' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveBracket(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <TextField
            label="Additional Income"
            type="number"
            value={additionalIncome}
            onChange={(e) => setAdditionalIncome(parseFloat(e.target.value) || 0)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            sx={{ flexGrow: 1, flexBasis: '200px' }}
          />
          
          <TextField
            label="Additional Deductions"
            type="number"
            value={additionalDeductions}
            onChange={(e) => setAdditionalDeductions(parseFloat(e.target.value) || 0)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            sx={{ flexGrow: 1, flexBasis: '200px' }}
          />
          
          <Button
            variant="contained"
            startIcon={<CalculateIcon />}
            onClick={handleCalculate}
            disabled={loading || !!validationError}
            sx={{ alignSelf: 'center' }}
          >
            Calculate
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
      
      {calculation && (
        <>
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Detailed Tax Calculation Results
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
            <Paper 
              elevation={2} 
              sx={{ 
                flex: '1 1 auto', 
                minWidth: { xs: '100%', sm: 'calc(33% - 16px)' },
                p: 2,
                bgcolor: 'primary.light',
                color: 'primary.contrastText'
              }}
            >
              <Typography variant="subtitle1">Total Tax</Typography>
              <Typography variant="h4">{formatCurrency(calculation.estimatedTaxLiability)}</Typography>
            </Paper>
            
            <Paper 
              elevation={2} 
              sx={{ 
                flex: '1 1 auto', 
                minWidth: { xs: '100%', sm: 'calc(33% - 16px)' },
                p: 2,
                bgcolor: 'secondary.light',
                color: 'secondary.contrastText'
              }}
            >
              <Typography variant="subtitle1">Taxable Income</Typography>
              <Typography variant="h4">{formatCurrency(calculation.taxableIncome)}</Typography>
            </Paper>
            
            <Paper 
              elevation={2} 
              sx={{ 
                flex: '1 1 auto', 
                minWidth: { xs: '100%', sm: 'calc(33% - 16px)' },
                p: 2,
                bgcolor: 'info.light',
                color: 'info.contrastText'
              }}
            >
              <Typography variant="subtitle1">Effective Tax Rate</Typography>
              <Typography variant="h4">{calculation.effectiveTaxRate.toFixed(2)}%</Typography>
            </Paper>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            Tax Breakdown by Bracket
          </Typography>
          
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bracket</TableCell>
                  <TableCell align="right">Rate</TableCell>
                  <TableCell align="right">Income in Bracket</TableCell>
                  <TableCell align="right">Tax Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calculation.bracketBreakdown.map((breakdown, index) => (
                  <TableRow key={index} sx={{ 
                    bgcolor: breakdown.incomeInBracket > 0 ? 'rgba(0, 0, 0, 0.04)' : 'inherit'
                  }}>
                    <TableCell>
                      {formatCurrency(breakdown.lowerBound)} - {formatCurrency(breakdown.upperBound)}
                    </TableCell>
                    <TableCell align="right">{breakdown.rate}%</TableCell>
                    <TableCell align="right">{formatCurrency(breakdown.incomeInBracket)}</TableCell>
                    <TableCell align="right">{formatCurrency(breakdown.taxForBracket)}</TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ fontWeight: 'bold' }}>
                  <TableCell colSpan={2}>
                    <Typography variant="subtitle2">Total</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2">{formatCurrency(calculation.taxableIncome)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2">{formatCurrency(calculation.estimatedTaxLiability)}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
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

export default TaxBracketComponent;