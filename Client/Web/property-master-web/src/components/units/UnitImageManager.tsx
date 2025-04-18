import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  useMediaQuery,
  Theme
} from '@mui/material';
import { 
  Add as AddIcon, 
  Close as CloseIcon, 
  CloudUpload as UploadIcon 
} from '@mui/icons-material';
import { useUnitImages } from '../../hooks/useUnitImages';

interface UnitImageManagerProps {
  propertyId: string;
  unitId: string;
}

const UnitImageManager: React.FC<UnitImageManagerProps> = ({ propertyId, unitId }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    images, 
    loading, 
    error, 
    fetchUnitImages, 
    uploadImages, 
    deleteImage 
  } = useUnitImages(propertyId, unitId);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchUnitImages();
  }, [propertyId, unitId]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      await uploadImages(fileArray);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageDelete = (imageUrl: string) => {
    deleteImage(imageUrl);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Unit Images
      </Typography>
      
      {/* File Upload Button */}
      <Box sx={{ mb: 2 }}>
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
            startIcon={<UploadIcon />}
            disabled={loading}
          >
            Upload Images
          </Button>
        </label>
      </Box>

      {/* Error Handling */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Image Container */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2,
          justifyContent: isMobile ? 'center' : 'flex-start'
        }}
      >
        {images.map((imageUrl) => (
          <Box 
            key={imageUrl} 
            sx={{ 
              position: 'relative', 
              width: isMobile ? '100%' : 'calc(25% - 16px)', 
              maxWidth: 300,
              minWidth: 200,
              border: '1px solid #ddd', 
              borderRadius: 2,
              overflow: 'hidden',
              mb: 2
            }}
          >
            <img 
              src={imageUrl} 
              alt="Unit" 
              style={{ 
                width: '100%', 
                height: 200, 
                objectFit: 'cover' 
              }}
              onClick={() => handleImageClick(imageUrl)}
            />
            <IconButton
              size="small"
              sx={{ 
                position: 'absolute', 
                top: 5, 
                right: 5, 
                bgcolor: 'rgba(255,255,255,0.7)' 
              }}
              onClick={() => handleImageDelete(imageUrl)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* Image Preview Dialog */}
      <Dialog 
        open={!!selectedImage} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Image Preview
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Full size" 
              style={{ 
                width: '100%', 
                maxHeight: '70vh', 
                objectFit: 'contain' 
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UnitImageManager;