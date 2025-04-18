import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, List, ListItem, CircularProgress, Alert } from '@mui/material';
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
        <Box>
          {images.length === 0 ? (
            <Alert severity="info">No images available for this unit</Alert>
          ) : (
            <List>
              {images.map((imageUrl, index) => (
                <ListItem key={index} divider>
                  <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>Image {index + 1}</Typography>
                    <Box display="flex" gap={2}>
                      <Button 
                        variant="outlined" 
                        onClick={() => window.open(imageUrl, '_blank')}
                      >
                        View
                      </Button>
                      <Button 
                        variant="contained" 
                        color="error" 
                        onClick={() => handleDeleteImage(imageUrl)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}
    </Box>
  );
};

export default UnitImageManager;