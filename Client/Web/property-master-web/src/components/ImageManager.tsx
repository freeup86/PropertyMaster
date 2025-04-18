import React, { useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button, 
  Card, 
  CardMedia, 
  CardActions, 
  CircularProgress, 
  Alert, 
  Box 
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useUnitImages } from '../hooks/useUnitImages';

interface ImageManagerProps {
  propertyId: string;
  unitId: string;
  open: boolean;
  onClose: () => void;
}

const ImageManager: React.FC<ImageManagerProps> = ({ 
  propertyId, 
  unitId, 
  open, 
  onClose 
}) => {
  const { 
    images, 
    loading, 
    error, 
    uploadImages, 
    deleteImage 
  } = useUnitImages(propertyId, unitId);
  
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      await uploadImages(Array.from(files));
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    await deleteImage(imageUrl);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>Manage Unit Images</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && !isUploading ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height={300}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {images.length === 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                No images uploaded for this unit
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {images.map((imageUrl, index) => (
                <Card key={index} sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 8px)' } }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={imageUrl}
                    alt={`Unit Image ${index + 1}`}
                  />
                  <CardActions>
                    <Button 
                      color="error" 
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteImage(imageUrl)}
                      disabled={isUploading}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </>
        )}

        {isUploading && (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height={100}
            mt={2}
          >
            <CircularProgress />
          </Box>
        )}

        <Box mt={2} display="flex" justifyContent="space-between">
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="unit-image-upload"
            multiple
            type="file"
            onChange={handleFileUpload}
            disabled={loading || isUploading}
          />
          <label htmlFor="unit-image-upload">
            <Button 
              variant="contained" 
              component="span" 
              startIcon={<AddIcon />}
              disabled={loading || isUploading}
            >
              Upload Images
            </Button>
          </label>
          <Button 
            variant="outlined" 
            onClick={onClose}
            disabled={loading || isUploading}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImageManager;