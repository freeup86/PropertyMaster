import React, { useState, useCallback, useEffect } from 'react';
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
  onDeleteUnit?: (unitId: string) => void;
  onManageImages?: (unitId: string) => void;
}

const UnitList: React.FC<UnitListProps> = ({ 
  propertyId, 
  onAddUnit, 
  onEditUnit, 
  onDeleteUnit, 
  onManageImages 
}) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = useCallback(async () => {
    if (!propertyId) {
      setError('Property ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedUnits = await unitService.getUnits(propertyId);
      setUnits(fetchedUnits);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load units. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const handleDeleteUnit = async (unitId: string) => {
    try {
      await unitService.deleteUnit(propertyId, unitId);
      setUnits(currentUnits => currentUnits.filter(unit => unit.id !== unitId));
      onDeleteUnit?.(unitId);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to delete unit. Please try again.';
      setError(errorMessage);
    }
  };

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