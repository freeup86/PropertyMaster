import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  FormControl, 
  Select, 
  MenuItem, 
  InputLabel, 
  SelectChangeEvent, 
  CircularProgress, 
  Alert, 
  Chip,
  OutlinedInput
} from '@mui/material';
import { CompareArrows as CompareIcon } from '@mui/icons-material';
import { Property } from '../services/propertyService';
import { PropertyPerformance } from '../services/financialService';
import propertyService from '../services/propertyService';
import financialService from '../services/financialService';
import PerformanceComparisonChart from './PerformanceComparisonChart';

interface PropertyComparisonToolProps {
  userId: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const PropertyComparisonTool: React.FC<PropertyComparisonToolProps> = ({ userId }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [performanceData, setPerformanceData] = useState<PropertyPerformance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await propertyService.getProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [userId]);

  const handleSelectionChange = (event: SelectChangeEvent<typeof selectedProperties>) => {
    const {
      target: { value },
    } = event;
    
    // On autofill we get a stringified value.
    setSelectedProperties(typeof value === 'string' ? value.split(',') : value);
  };

  const handleCompareProperties = async () => {
    if (selectedProperties.length === 0) {
      setError('Please select at least one property to compare');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const performancePromises = selectedProperties.map((propertyId) =>
        financialService.getPropertyPerformance(propertyId)
      );
      const performanceResults = await Promise.all(performancePromises);
      setPerformanceData(performanceResults);
    } catch (error) {
      console.error('Error fetching property performance data:', error);
      setError('Failed to fetch performance data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getPropertyName = (propertyId: string): string => {
    const property = properties.find(p => p.id === propertyId);
    return property?.name || 'Unknown Property';
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Property Comparison Tool
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Select multiple properties to compare their financial performance
        </Typography>

        {isLoading && !performanceData.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error && !performanceData.length ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="property-select-label">Select Properties</InputLabel>
              <Select
                labelId="property-select-label"
                id="property-select"
                multiple
                value={selectedProperties}
                onChange={handleSelectionChange}
                input={<OutlinedInput id="select-multiple-chip" label="Select Properties" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={getPropertyName(value)} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {properties.map((property) => (
                  <MenuItem
                    key={property.id}
                    value={property.id}
                  >
                    {property.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCompareProperties}
                disabled={isLoading || selectedProperties.length === 0}
                startIcon={<CompareIcon />}
              >
                {isLoading ? 'Loading...' : `Compare ${selectedProperties.length} Properties`}
              </Button>
            </Box>
          </>
        )}

        {performanceData.length > 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Performance Comparison
            </Typography>
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 3 }}>
              <PerformanceComparisonChart data={performanceData} />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {performanceData.map((performance) => {
                const propertyName = getPropertyName(performance.propertyId);
                return (
                  <Card key={performance.propertyId} sx={{ 
                    width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 11px)' }, 
                    bgcolor: 'background.paper'
                  }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {propertyName}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="textSecondary">ROI</Typography>
                          <Typography variant="body2">
                            {(performance as any).roi !== undefined ? `${(performance as any).roi}%` : 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="textSecondary">Cash Flow</Typography>
                          <Typography variant="body2">
                            {(performance as any).monthlyCashFlow !== undefined 
                              ? formatCurrency((performance as any).monthlyCashFlow) + '/mo' 
                              : 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="textSecondary">Cap Rate</Typography>
                          <Typography variant="body2">
                            {(performance as any).capRate !== undefined ? `${(performance as any).capRate}%` : 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Box>
        ) : selectedProperties.length > 0 && !isLoading ? (
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Ready to Compare
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Click "Compare Properties" to view performance data
            </Typography>
          </Box>
        ) : !isLoading ? (
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              No Properties Selected
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Select properties above to begin comparison
            </Typography>
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default PropertyComparisonTool;