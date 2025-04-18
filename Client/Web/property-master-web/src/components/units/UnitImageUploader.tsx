import React, { useState, useRef, useEffect } from 'react';
import { 
  Button, 
  Box, 
  Typography 
} from '@mui/material';
import unitImageService, { UnitImageDto } from '../../services/unitImageService';

interface UnitImageUploaderProps {
  propertyId: string;
  unitId: string;
  onImagesUploaded?: (imageUrls: string[]) => void;
}

const UnitImageUploader: React.FC<UnitImageUploaderProps> = ({ 
  propertyId, 
  unitId, 
  onImagesUploaded 
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    if (!propertyId || !unitId) return;

    try {
      setLoading(true);
      const response = await unitImageService.getUnitImages(propertyId, unitId);
      
      // Convert base64 to data URLs
      const dataUrls = response.map((img: UnitImageDto) => 
        `data:${img.contentType};base64,${img.base64ImageData}`
      );
      
      setImageUrls(dataUrls);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch images', err);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [propertyId, unitId]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        setLoading(true);
        const fileArray = Array.from(files);
        const response = await unitImageService.uploadUnitImages(propertyId, unitId, fileArray);
        
        // Refetch images to ensure latest state
        await fetchImages();
        
        if (onImagesUploaded) {
          onImagesUploaded(imageUrls);
        }
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to upload images');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        id="unit-image-upload"
      />
      <label htmlFor="unit-image-upload">
        <Button 
          variant="contained" 
          component="span"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Images'}
        </Button>
      </label>

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      {/* Image Display */}
      {imageUrls.length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          mt: 2 
        }}>
          {imageUrls.map((url, index) => (
            <Box 
              key={index} 
              sx={{ 
                width: 200, 
                height: 200, 
                overflow: 'hidden', 
                borderRadius: 2,
                position: 'relative'
              }}
            >
              <img 
                src={url} 
                alt={`Unit Image ${index + 1}`} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }} 
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UnitImageUploader;