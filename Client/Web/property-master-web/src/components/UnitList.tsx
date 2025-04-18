import React, { useState, useCallback, useEffect, useRef } from 'react';
 import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Box, 
  CircularProgress, 
  Alert 
} from '@mui/material';
 import { Add as AddIcon } from '@mui/icons-material';
 import unitService, { Unit } from '../services/unitService';
 
 // Define props interface
 interface UnitListProps {
  propertyId: string;
  onAddUnit?: () => void;
  onEditUnit?: (unitId: string) => Promise<void>;
  onDeleteUnit?: (unitId: string)=> void;
  onManageImages?: (unitId: string)=> void;
 }
 
 const UnitList: React.FC<UnitListProps> = ({ 
  propertyId, 
  onAddUnit, 
  onEditUnit, 
  onDeleteUnit, 
  onManageImages 
}) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renderCountRef = useRef(0);
  renderCountRef.current++;

  console.log(`UnitList Rendered (${renderCountRef.current}) - propertyId:`, propertyId, 'state:', units);

 
  const fetchUnits = useCallback(async () => {
    console.log('fetchUnits called', { propertyId });
    if (!propertyId) {
      setError('Property ID is required');
      setLoading(false);
      return;
    }
 
    try {
      setLoading(true);
      setError(null);
      const fetchedUnits = await unitService.getUnits(propertyId);
      console.log('fetchUnits response:', fetchedUnits); // Log the response
      setUnits(fetchedUnits);
      console.log('fetchUnits completed, state updated:', units); // Log state *after* update
    } catch (err: any) {
      console.error('fetchUnits error:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load units. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('fetchUnits finally, loading set to false');
    }
  }, [propertyId]);
 
  useEffect(() => {
    console.log('useEffect - fetchUnits called on mount');
    fetchUnits();
  }, []); //  **** EMPTY dependency array - runs only ONCE on mount ****
 
  const handleDeleteUnit = useCallback(async (unitId: string) => {
    console.log('handleDeleteUnit called for unitId:', unitId);
    try {
      await unitService.deleteUnit(propertyId, unitId);
      setUnits(currentUnits => currentUnits.filter(unit => unit.id !== unitId));
      onDeleteUnit?.(unitId);
      console.log('handleDeleteUnit completed for unitId:', unitId);
    } catch (err: any) {
      console.error('handleDeleteUnit error:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to delete unit. Please try again.';
      setError(errorMessage);
    }
  }, [propertyId, onDeleteUnit]);
 
  const handleManageImages = useCallback((unitId: string) => {
    console.log('handleManageImages called for unitId:', unitId);
    if (onManageImages) {
      console.log('handleManageImages callback called');
      onManageImages(unitId);
    } else {
      console.warn('onManageImages callback is undefined!');
    }
  }, [onManageImages]);
 
  const handleEditUnit = useCallback((unitId: string) => {
    console.log('handleEditUnit called for unitId:', unitId);
    if (onEditUnit) {
      console.log('handleEditUnit callback called');
      onEditUnit(unitId);
    } else {
      console.warn('onEditUnit callback is undefined!');
    }
  }, [onEditUnit]);
 
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }
 
  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
 
  return (
    <Container maxWidth="lg">
      {units.length === 0 ? (
        <Box textAlign="center" p={4}>
          <Typography variant="h6" gutterBottom>
            No units found for this property.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Add your first unit to start managing the property.
          </Typography>
          {onAddUnit && (
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={onAddUnit}
              sx={{ mt: 2 }}
            >
              Add Unit
            </Button>
          )}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {units.map((unit) => (
            <Card 
              key={unit.id} 
              sx={{ 
                width: { 
                  xs: '100%', 
                  sm: 'calc(50% - 16px)', 
                  md: 'calc(33.33% - 16px)' 
                }, 
                display: 'flex', 
                flexDirection: 'column' 
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Unit {unit.unitNumber}
                </Typography>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Box sx={{ width: '50%' }}>
                    <Typography variant="caption" color="textSecondary">
                      Size
                    </Typography>
                    <Typography variant="body1">
                      {unit.size} sq ft
                    </Typography>
                  </Box>
                  <Box sx={{ width: '50%' }}>
                    <Typography variant="caption" color="textSecondary">
                      Market Rent
                    </Typography>
                    <Typography variant="body1">
                      ${unit.marketRent.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Box sx={{ width: '50%' }}>
                    <Typography variant="caption" color="textSecondary">
                      Bedrooms
                    </Typography>
                    <Typography variant="body1">
                      {unit.bedrooms}
                    </Typography>
                  </Box>
                  <Box sx={{ width: '50%' }}>
                    <Typography variant="caption" color="textSecondary">
                      Bathrooms
                    </Typography>
                    <Typography variant="body1">
                      {unit.bathrooms}
                    </Typography>
                  </Box>
                </Box>
                <Typography 
                  variant="body2" 
                  color={unit.isOccupied ? 'success.main' : 'error.main'}
                >
                  {unit.isOccupied ? 'Occupied' : 'Vacant'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  onClick={() => onManageImages?.(unit.id)}
                >
                  Manage Images
                </Button>
                <Button 
                  size="small" 
                  color="primary" 
                  onClick={() => onEditUnit?.(unit.id)}
                >
                  Edit
                </Button>
                <Button 
                  size="small" 
                  color="error" 
                  onClick={() => handleDeleteUnit(unit.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
 };
 
 export default UnitList;