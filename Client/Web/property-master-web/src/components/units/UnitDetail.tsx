import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Button 
} from '@mui/material';
import UnitImageUploader from '../../components/units/UnitImageUploader';
import { UnitDto } from '../../services/unitService';

interface UnitDetailProps {
  unit: UnitDto;
  propertyId: string;
}

const UnitDetail: React.FC<UnitDetailProps> = ({ unit, propertyId }) => {
  const [imageUrls, setImageUrls] = useState<string[]>(unit.imageUrls || []);

  const handleImagesUploaded = (newImageUrls: string[]) => {
    setImageUrls(prevUrls => [...prevUrls, ...newImageUrls]);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Unit Details: {unit.unitNumber}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Unit Basic Information */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: '1 1 200px' }}>
          <Typography variant="subtitle2" color="textSecondary">
            Size
          </Typography>
          <Typography variant="body1">
            {unit.size} sq ft
          </Typography>
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <Typography variant="subtitle2" color="textSecondary">
            Bedrooms
          </Typography>
          <Typography variant="body1">
            {unit.bedrooms}
          </Typography>
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <Typography variant="subtitle2" color="textSecondary">
            Bathrooms
          </Typography>
          <Typography variant="body1">
            {unit.bathrooms}
          </Typography>
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <Typography variant="subtitle2" color="textSecondary">
            Market Rent
          </Typography>
          <Typography variant="body1">
            ${unit.marketRent.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <Typography variant="subtitle2" color="textSecondary">
            Occupancy Status
          </Typography>
          <Typography 
            variant="body1" 
            color={unit.isOccupied ? 'success.main' : 'error.main'}
          >
            {unit.isOccupied ? 'Occupied' : 'Vacant'}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Image Upload and Display Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Unit Images
        </Typography>
        <UnitImageUploader 
          propertyId={propertyId} 
          unitId={unit.id}
          onImagesUploaded={handleImagesUploaded}
        />
      </Box>

      {/* Image Display */}
      {imageUrls.length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          justifyContent: 'flex-start' 
        }}>
          {imageUrls.map((url) => {
            console.log('Image URL:', url); // Log each URL
            return (
              <Box 
                key={url} 
                sx={{ 
                  width: 200, 
                  height: 200, 
                  overflow: 'hidden', 
                  borderRadius: 2 
                }}
              >
                <img 
                  src={url} 
                  alt="Unit" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default UnitDetail;