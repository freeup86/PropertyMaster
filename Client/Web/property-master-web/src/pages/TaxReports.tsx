import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  Alert,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';
import TaxReportComponent from '../components/tax/TaxReportComponent';
import MultiYearComparisonComponent from '../components/tax/MultiYearComparisonComponent';
import propertyService, { Property } from '../services/propertyService';
import { exportTaxReportToPdf } from '../services/pdfExportService';
import taxReportService, { 
  TaxReport, 
  MultiYearTaxComparison, 
  TaxEstimation, 
  TaxEstimationRequest ,
  TaxBracketCalculationRequest,
  TaxBracketCalculation
} from '../services/taxReportService';
import TaxEstimationComponent from '../components/tax/TaxEstimationComponent';
import TaxBracketComponent from '../components/tax/TaxBracketComponent';
import TaxDocumentsManager from '../components/tax/TaxDocumentsManager';

  const TaxReports: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [selectedTaxYear, setSelectedTaxYear] = useState<number>(new Date().getFullYear() - 1);
  const [taxReport, setTaxReport] = useState<TaxReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [tabValue, setTabValue] = useState<string>('singleYear');
  const [multiYearComparison, setMultiYearComparison] = useState<MultiYearTaxComparison | null>(null);
  const [startYear, setStartYear] = useState<number>(new Date().getFullYear() - 3);
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear() - 1);
  const [multiYearLoading, setMultiYearLoading] = useState<boolean>(false);
  const [multiYearError, setMultiYearError] = useState<string | null>(null);
  const [taxEstimation, setTaxEstimation] = useState<TaxEstimation | null>(null);
  const [estimationLoading, setEstimationLoading] = useState<boolean>(false);
  const [estimationError, setEstimationError] = useState<string | null>(null);
  const [bracketCalculation, setBracketCalculation] = useState<TaxBracketCalculation | null>(null);
  const [bracketCalculationLoading, setBracketCalculationLoading] = useState<boolean>(false);
  const [bracketCalculationError, setBracketCalculationError] = useState<string | null>(null);
  

  const availableYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const fetchProperties = async () => {
    try {
      const data = await propertyService.getProperties();
      setProperties(data);
      if (data.length > 0) {
        setSelectedPropertyId(data[0].id);
      }
    } catch (err) {
      setError('Failed to load properties. Please try again later.');
    }
  };

  const handleEstimateTaxes = async (request: TaxEstimationRequest) => {
    setEstimationLoading(true);
    setEstimationError(null);
  
    try {
      const estimation = await taxReportService.estimateTaxes(request);
      setTaxEstimation(estimation);
    } catch (err) {
      setEstimationError('Failed to generate tax estimation. Please try again later.');
      setTaxEstimation(null);
    } finally {
      setEstimationLoading(false);
    }
  };

  const handleCalculateWithBrackets = async (request: TaxBracketCalculationRequest) => {
    setBracketCalculationLoading(true);
    setBracketCalculationError(null);
  
    try {
      const calculation = await taxReportService.calculateWithBrackets(request);
      setBracketCalculation(calculation);
    } catch (err) {
      setBracketCalculationError('Failed to calculate taxes with brackets. Please try again later.');
      setBracketCalculation(null);
    } finally {
      setBracketCalculationLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchTaxReport = async () => {
    if (!selectedPropertyId) return;

    setLoading(true);
    setError(null);

    try {
      const report = await taxReportService.getPropertyTaxReport(selectedPropertyId, selectedTaxYear);
      setTaxReport(report);
    } catch (err) {
      setError('Failed to load tax report. Please try again later.');
      setTaxReport(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMultiYearComparison = async () => {
    if (!selectedPropertyId) return;

    setMultiYearLoading(true);
    setMultiYearError(null);

    try {
      const comparison = await taxReportService.getMultiYearTaxComparison(
        selectedPropertyId, 
        startYear, 
        endYear
      );
      setMultiYearComparison(comparison);
    } catch (err) {
      setMultiYearError('Failed to load multi-year comparison. Please try again later.');
      setMultiYearComparison(null);
    } finally {
      setMultiYearLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPropertyId && selectedTaxYear) {
      fetchTaxReport();
    }
  }, [selectedPropertyId, selectedTaxYear]);

  const handlePropertyChange = (event: SelectChangeEvent) => {
    setSelectedPropertyId(event.target.value as string);
  };

  const handleTaxYearChange = (event: SelectChangeEvent) => {
    setSelectedTaxYear(Number(event.target.value));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    if (newValue === 'multiYear' && selectedPropertyId && !multiYearComparison) {
      fetchMultiYearComparison();
    }
  };

  const handleStartYearChange = (event: SelectChangeEvent) => {
    const newStartYear = Number(event.target.value);
    setStartYear(newStartYear);
    if (newStartYear > endYear) {
      setEndYear(newStartYear);
    }
  };

  const handleEndYearChange = (event: SelectChangeEvent) => {
    const newEndYear = Number(event.target.value);
    setEndYear(newEndYear);
  };

  const handleCompareYears = () => {
    fetchMultiYearComparison();
  };

  const handleExportPdf = (taxReport: TaxReport) => {
    exportTaxReportToPdf(taxReport);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Tax Reports</Typography>
      
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange}>
            <Tab label="Single Year Report" value="singleYear" />
            <Tab label="Multi-Year Comparison" value="multiYear" />
            <Tab label="Tax Estimation" value="taxEstimation" />
            <Tab label="Tax Brackets" value="taxBrackets" />
            <Tab label="Tax Documents" value="taxDocuments" />
          </TabList>
        </Box>
        
        <TabPanel value="singleYear">
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <Box sx={{ width: { xs: '100%', md: '48%' }, mr: { md: '4%' }, mb: { xs: 2, md: 0 } }}>
                <FormControl fullWidth>
                  <InputLabel id="property-select-label">Property</InputLabel>
                  <Select
                    labelId="property-select-label"
                    id="property-select"
                    value={selectedPropertyId}
                    label="Property"
                    onChange={handlePropertyChange}
                  >
                    {properties.map((property) => (
                      <MenuItem key={property.id} value={property.id}>
                        {property.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ width: { xs: '100%', md: '48%' } }}>
                <FormControl fullWidth>
                  <InputLabel id="tax-year-select-label">Tax Year</InputLabel>
                  <Select
                    labelId="tax-year-select-label"
                    id="tax-year-select"
                    value={selectedTaxYear.toString()}
                    label="Tax Year"
                    onChange={handleTaxYearChange}
                  >
                    {availableYears.map((year) => (
                      <MenuItem key={year} value={year.toString()}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>

          <TaxReportComponent 
            taxReport={taxReport} 
            loading={loading} 
            error={error} 
            onExportPdf={handleExportPdf}
          />
        </TabPanel>
        
        <TabPanel value="multiYear">
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Box sx={{ width: { xs: '100%', md: '32%' }, mb: { xs: 2, md: 0 }, mr: { md: '2%' } }}>
                <FormControl fullWidth>
                  <InputLabel id="multi-year-property-select-label">Property</InputLabel>
                  <Select
                    labelId="multi-year-property-select-label"
                    id="multi-year-property-select"
                    value={selectedPropertyId}
                    label="Property"
                    onChange={handlePropertyChange}
                  >
                    {properties.map((property) => (
                      <MenuItem key={property.id} value={property.id}>
                        {property.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ width: { xs: '48%', md: '22%' }, mb: { xs: 2, md: 0 }, mr: { xs: '4%', md: '2%' } }}>
                <FormControl fullWidth>
                  <InputLabel id="start-year-select-label">Start Year</InputLabel>
                  <Select
                    labelId="start-year-select-label"
                    id="start-year-select"
                    value={startYear.toString()}
                    label="Start Year"
                    onChange={handleStartYearChange}
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                      <MenuItem key={year} value={year.toString()}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ width: { xs: '48%', md: '22%' }, mb: { xs: 2, md: 0 }, mr: { md: '2%' } }}>
                <FormControl fullWidth>
                  <InputLabel id="end-year-select-label">End Year</InputLabel>
                  <Select
                    labelId="end-year-select-label"
                    id="end-year-select"
                    value={endYear.toString()}
                    label="End Year"
                    onChange={handleEndYearChange}
                  >
                    {Array.from({ length: 5 }, (_, i) => Math.max(startYear, new Date().getFullYear() - 5 + i)).map((year) => (
                      <MenuItem 
                        key={year} 
                        value={year.toString()}
                        disabled={year < startYear}
                      >
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ width: { xs: '100%', md: '18%' }, display: 'flex', alignItems: 'center' }}>
                <Button 
                  variant="contained" 
                  onClick={handleCompareYears}
                  fullWidth
                  sx={{ py: 1 }}
                >
                  Compare
                </Button>
              </Box>
            </Box>
          </Paper>

          <MultiYearComparisonComponent 
            comparison={multiYearComparison} 
            loading={multiYearLoading} 
            error={multiYearError} 
          />
        </TabPanel>

        <TabPanel value="taxEstimation">
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <Box sx={{ width: { xs: '100%', md: '48%' }, mr: { md: '4%' }, mb: { xs: 2, md: 0 } }}>
                <FormControl fullWidth>
                  <InputLabel id="tax-estimation-property-select-label">Property</InputLabel>
                  <Select
                    labelId="tax-estimation-property-select-label"
                    id="tax-estimation-property-select"
                    value={selectedPropertyId}
                    label="Property"
                    onChange={handlePropertyChange}
                  >
                    {properties.map((property) => (
                      <MenuItem key={property.id} value={property.id}>
                        {property.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ width: { xs: '100%', md: '48%' } }}>
                <FormControl fullWidth>
                  <InputLabel id="tax-estimation-year-select-label">Tax Year</InputLabel>
                  <Select
                    labelId="tax-estimation-year-select-label"
                    id="tax-estimation-year-select"
                    value={selectedTaxYear.toString()}
                    label="Tax Year"
                    onChange={handleTaxYearChange}
                  >
                    {availableYears.map((year) => (
                      <MenuItem key={year} value={year.toString()}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>
          
          <TaxEstimationComponent
            propertyId={selectedPropertyId}
            taxYear={selectedTaxYear}
            onEstimateTaxes={handleEstimateTaxes}
            estimation={taxEstimation}
            loading={estimationLoading}
            error={estimationError}
          />
        </TabPanel>

        <TabPanel value="taxBrackets">
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Box sx={{ width: { xs: '100%', md: '48%' }, mr: { md: '4%' }, mb: { xs: 2, md: 0 } }}>
                  <FormControl fullWidth>
                    <InputLabel id="tax-brackets-property-select-label">Property</InputLabel>
                    <Select
                      labelId="tax-brackets-property-select-label"
                      id="tax-brackets-property-select"
                      value={selectedPropertyId}
                      label="Property"
                      onChange={handlePropertyChange}
                    >
                      {properties.map((property) => (
                        <MenuItem key={property.id} value={property.id}>
                          {property.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                <Box sx={{ width: { xs: '100%', md: '48%' } }}>
                  <FormControl fullWidth>
                    <InputLabel id="tax-brackets-year-select-label">Tax Year</InputLabel>
                    <Select
                      labelId="tax-brackets-year-select-label"
                      id="tax-brackets-year-select"
                      value={selectedTaxYear.toString()}
                      label="Tax Year"
                      onChange={handleTaxYearChange}
                    >
                      {availableYears.map((year) => (
                        <MenuItem key={year} value={year.toString()}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Paper>

            <TaxBracketComponent
              propertyId={selectedPropertyId}
              taxYear={selectedTaxYear}
              onCalculateTaxes={handleCalculateWithBrackets}
              calculation={bracketCalculation}
              loading={bracketCalculationLoading}
              error={bracketCalculationError}
            />
          </TabPanel>
      
        <TabPanel value="taxDocuments">
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <Box sx={{ width: { xs: '100%', md: '48%' }, mr: { md: '4%' }, mb: { xs: 2, md: 0 } }}>
                <FormControl fullWidth>
                  <InputLabel id="tax-documents-property-select-label">Property</InputLabel>
                  <Select
                    labelId="tax-documents-property-select-label"
                    id="tax-documents-property-select"
                    value={selectedPropertyId}
                    label="Property"
                    onChange={handlePropertyChange}
                  >
                    {properties.map((property) => (
                      <MenuItem key={property.id} value={property.id}>
                        {property.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ width: { xs: '100%', md: '48%' } }}>
                <FormControl fullWidth>
                  <InputLabel id="tax-documents-year-select-label">Tax Year</InputLabel>
                  <Select
                    labelId="tax-documents-year-select-label"
                    id="tax-documents-year-select"
                    value={selectedTaxYear.toString()}
                    label="Tax Year"
                    onChange={handleTaxYearChange}
                  >
                    {availableYears.map((year) => (
                      <MenuItem key={year} value={year.toString()}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>

          <TaxDocumentsManager
            propertyId={selectedPropertyId}
            taxYear={selectedTaxYear}
          />
        </TabPanel>
      </TabContext>
    </Container>
  );
};

export default TaxReports;