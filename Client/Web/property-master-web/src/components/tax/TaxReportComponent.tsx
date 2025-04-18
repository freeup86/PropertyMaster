import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Stack, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Alert,
  Button,
  useMediaQuery,
  Theme
} from '@mui/material';
import { TaxReport } from '../../services/taxReportService';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { exportTaxReportToPdf } from '../../services/pdfExportService';

interface TaxReportComponentProps {
  taxReport: TaxReport | null;
  loading: boolean;
  error: string | null;
  onExportPdf?: (taxReport: TaxReport) => void;
}

const TaxReportComponent: React.FC<TaxReportComponentProps> = ({ 
  taxReport, 
  loading, 
  error,
  onExportPdf 
}) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!taxReport) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No tax report data available. Please select a property and tax year.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Tax Report for {taxReport.propertyName} - {taxReport.taxYear}
        </Typography>
        {onExportPdf && (
          <Button 
            variant="outlined" 
            startIcon={<PdfIcon />}
            onClick={() => onExportPdf(taxReport)}
          >
            Export PDF
          </Button>
        )}
      </Box>

      <Stack 
        direction={isMobile ? 'column' : 'row'} 
        spacing={2} 
        sx={{ 
          width: '100%', 
          justifyContent: 'space-between',
          mb: 3 
        }}
      >
        <Paper 
          sx={{ 
            p: 2, 
            bgcolor: 'primary.light', 
            color: 'primary.contrastText',
            flex: 1,
            minWidth: isMobile ? '100%' : 0,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6">Total Income</Typography>
          <Typography variant="h4">{formatCurrency(taxReport.totalIncome)}</Typography>
        </Paper>
        
        <Paper 
          sx={{ 
            p: 2, 
            bgcolor: 'success.light', 
            color: 'success.contrastText',
            flex: 1,
            minWidth: isMobile ? '100%' : 0,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6">Total Deductible Expenses</Typography>
          <Typography variant="h4">{formatCurrency(taxReport.totalDeductibleExpenses)}</Typography>
        </Paper>
        
        <Paper 
          sx={{ 
            p: 2, 
            bgcolor: 'info.light', 
            color: 'info.contrastText',
            flex: 1,
            minWidth: isMobile ? '100%' : 0,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6">Taxable Income</Typography>
          <Typography variant="h4">{formatCurrency(taxReport.taxableIncome)}</Typography>
        </Paper>
      </Stack>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Income Details</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Tax Deductible</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taxReport.incomeCategories.map((category) => (
                <TableRow key={category.categoryId}>
                  <TableCell>{category.categoryName}</TableCell>
                  <TableCell align="right">{formatCurrency(category.amount)}</TableCell>
                  <TableCell align="center">{category.isTaxDeductible ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Total Income</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(taxReport.totalIncome)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Expense Details</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Tax Deductible</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taxReport.expenseCategories.map((category) => (
                <TableRow key={category.categoryId}>
                  <TableCell>{category.categoryName}</TableCell>
                  <TableCell align="right">{formatCurrency(category.amount)}</TableCell>
                  <TableCell align="center">{category.isTaxDeductible ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Total Expenses</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(taxReport.expenseCategories.reduce((sum, cat) => sum + cat.amount, 0))}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Total Deductible Expenses</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(taxReport.totalDeductibleExpenses)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default TaxReportComponent;