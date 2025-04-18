import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { useUnitImages } from '../../hooks/useUnitImages';

interface UnitImageManagerProps {
  propertyId: string;
  unitId: string;
}

const UnitImageManager: React.FC<UnitImageManagerProps> = ({ propertyId, unitId }) => {
  const { images, loading, error, fetchUnitImages, uploadImages, deleteImage } = useUnitImages(propertyId, unitId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [debugMessage, setDebugMessage] = useState<string>("");

  useEffect(() => {
    fetchUnitImages();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        await uploadImages(Array.from(files));
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      setDebugMessage(`Attempting to delete image...`);
      await deleteImage(imageUrl);
      setDebugMessage(`Delete operation completed`);
    } catch (err) {
      console.error("Delete error:", err);
      setDebugMessage(`Error deleting image: ${err}`);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Unit Images ({images.length})</Typography>
        <Button 
          variant="contained" 
          startIcon={<UploadIcon />}
          onClick={handleUploadClick}
          disabled={loading}
        >
          Upload Images
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {debugMessage && <Alert severity="info" sx={{ mb: 2 }}>{debugMessage}</Alert>}
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {images.map((imageUrl, index) => (
            <Box key={index} position="relative" width={200} height={200} overflow="hidden">
              <img 
                src={imageUrl} 
                alt={`Image ${index + 1}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDeleteImage(imageUrl)}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                }}
              >
                Delete
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UnitImageManager;