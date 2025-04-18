import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  IconButton, 
  Typography,
  Card,
  CardMedia,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon, Upload as UploadIcon } from '@mui/icons-material';
import { useUnitImages } from '../../hooks/useUnitImages';

interface UnitImageUploaderProps {
  propertyId: string;
  unitId: string;
  onImagesUploaded?: (imageUrls: string[]) => void; // Changed to accept imageUrls parameter
}

const UnitImageUploader: React.FC<UnitImageUploaderProps> = ({ 
  propertyId, 
  unitId, 
  onImagesUploaded 
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { images, loading, error, fetchUnitImages, uploadImages, deleteImage } = useUnitImages(propertyId, unitId);
  const [confirmDialog, setConfirmDialog] = useState<{open: boolean, imageUrl: string | null}>({
    open: false,
    imageUrl: null
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    if (propertyId && unitId) {
      fetchUnitImages();
    }
  }, [propertyId, unitId, fetchUnitImages]);

  // Call the callback whenever images change
  useEffect(() => {
    if (onImagesUploaded && images.length >= 0) {
      onImagesUploaded(images);
    }
  }, [images, onImagesUploaded]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      try {
        const newImageUrls = await uploadImages(selectedFiles);
        setSelectedFiles([]);
        setUploadSuccess(true);
        // Hide success message after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000);
        // Reload images after upload
        fetchUnitImages();
        // The callback will be called via the useEffect when images are updated
      } catch (err) {
        console.error("Error uploading images:", err);
      }
    }
  };

  const openDeleteConfirm = (imageUrl: string) => {
    setConfirmDialog({
      open: true,
      imageUrl
    });
  };

  const handleDeleteConfirm = async () => {
    if (confirmDialog.imageUrl) {
      try {
        await deleteImage(confirmDialog.imageUrl);
        setDeleteSuccess(true);
        // Hide success message after 3 seconds
        setTimeout(() => setDeleteSuccess(false), 3000);
        // Reload images after deletion
        fetchUnitImages();
        // The callback will be called via the useEffect when images are updated
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
    setConfirmDialog({ open: false, imageUrl: null });
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ open: false, imageUrl: null });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>Unit Images</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {uploadSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Images uploaded successfully!
        </Alert>
      )}

      {deleteSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Image deleted successfully!
        </Alert>
      )}
      
      <Box mb={3}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="image-upload"
          type="file"
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="image-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<UploadIcon />}
            sx={{ mr: 2 }}
          >
            Select Images
          </Button>
        </label>
        
        {selectedFiles.length > 0 && (
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={loading}
          >
            Upload {selectedFiles.length} Image(s)
          </Button>
        )}
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {images.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No images uploaded for this unit.
            </Typography>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              justifyContent: 'flex-start'
            }}>
              {images.map((image, index) => (
                <Card key={index} sx={{ 
                  width: { xs: '100%', sm: '220px' },
                  height: '240px',
                  display: 'flex', 
                  flexDirection: 'column'
                }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={image}
                    alt={`Unit image ${index + 1}`}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardActions sx={{ 
                    mt: 'auto', 
                    p: 1, 
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <IconButton 
                      color="error" 
                      onClick={() => openDeleteConfirm(image)}
                      aria-label="delete image"
                      size="small"
                    >
                      <DeleteIcon />
                      <Typography variant="body2" sx={{ ml: 1 }}>Delete</Typography>
                    </IconButton>
                  </CardActions>
                </Card>
              ))}
            </Box>
          )}
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this image? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UnitImageUploader;