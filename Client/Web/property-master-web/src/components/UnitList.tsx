import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  IconButton, 
  Box,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import unitService, { Unit } from '../services/unitService';

interface UnitListProps {
  propertyId: string;
  onAddUnit: () => void;
  onEditUnit: (unitId: string) => void;
  onDeleteUnit: (unitId: string) => void;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        const data = await unitService.getUnits(propertyId);
        // Advanced sorting function for unit numbers
        const sortedUnits = data.sort((a, b) => {
          // Function to extract all numeric components
          const extractNumbers = (unitNumber: string) => {
            // Match all number sequences in the unit number
            const matches = unitNumber.match(/\d+/g) || [];
            // Convert to numbers, default to 0 if no matches
            return matches.map(num => parseInt(num, 10));
          };

          const aNumbers = extractNumbers(a.unitNumber);
          const bNumbers = extractNumbers(b.unitNumber);

          // Compare each numeric component in order
          for (let i = 0; i < Math.max(aNumbers.length, bNumbers.length); i++) {
            const aNum = aNumbers[i] || 0;
            const bNum = bNumbers[i] || 0;
            
            if (aNum !== bNum) {
              return aNum - bNum;
            }
          }

          // If all numeric components are equal, fall back to string comparison
          return a.unitNumber.localeCompare(b.unitNumber);
        });

        setUnits(sortedUnits);
        setLoading(false);
      } catch (err) {
        setError('Failed to load units. Please try again later.');
        setLoading(false);
      }
    };

    fetchUnits();
  }, [propertyId]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Units ({units.length})
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />}
          onClick={onAddUnit}
        >
          Add Unit
        </Button>
      </Box>
      
      {units.length === 0 ? (
        <Typography variant="body1">
          No units found for this property. Add a unit to get started.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Unit Number</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Bedrooms</TableCell>
                <TableCell>Bathrooms</TableCell>
                <TableCell>Market Rent</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.unitNumber}</TableCell>
                  <TableCell>{unit.size} sq ft</TableCell>
                  <TableCell>{unit.bedrooms}</TableCell>
                  <TableCell>{unit.bathrooms}</TableCell>
                  <TableCell>{formatCurrency(unit.marketRent)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={unit.isOccupied ? 'Occupied' : 'Vacant'} 
                      color={unit.isOccupied ? 'success' : 'default'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {onManageImages && (
                      <IconButton 
                        size="small" 
                        onClick={() => onManageImages(unit.id)}
                        color="secondary"
                        title="Manage Images"
                      >
                        <ImageIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton 
                      size="small" 
                      onClick={() => onEditUnit(unit.id)}
                      color="primary"
                      title="Edit Unit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => onDeleteUnit(unit.id)}
                      color="error"
                      title="Delete Unit"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UnitList;