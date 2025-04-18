import React, { useState, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Box,
  Alert,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import UnitList from '../components/UnitList';
import ImageManager from '../components/ImageManager';
import unitService, { Unit, CreateUnitRequest, UpdateUnitRequest } from '../services/unitService';

// Define props interface
interface UnitManagerProps {
  propertyId: string;
}

const UnitManager: React.FC<UnitManagerProps> = ({ propertyId }) => {
  // State for managing units and modals
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for add/edit unit
  const [unitForm, setUnitForm] = useState<CreateUnitRequest | UpdateUnitRequest>({
    unitNumber: '',
    size: 0,
    bedrooms: 0,
    bathrooms: 0,
    marketRent: 0,
    isOccupied: false
  });

  // Open modal for adding a new unit
  const handleAddUnit = () => {
    setSelectedUnit(null);
    setUnitForm({
      unitNumber: '',
      size: 0,
      bedrooms: 0,
      bathrooms: 0,
      marketRent: 0,
      isOccupied: false
    });
    setIsAddEditModalOpen(true);
  };

  // Open modal for editing an existing unit
  const handleEditUnit = async (unitId: string) => {
    try {
      const unit = await unitService.getUnit(propertyId, unitId);
      setSelectedUnit(unit);
      setUnitForm({
        unitNumber: unit.unitNumber,
        size: unit.size,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        marketRent: unit.marketRent,
        isOccupied: unit.isOccupied
      });
      setIsAddEditModalOpen(true);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load unit details';
      setError(errorMessage);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUnitForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  // Submit unit (add or edit)
  const handleSubmitUnit = async () => {
    try {
      if (selectedUnit) {
        // Editing existing unit
        await unitService.updateUnit(
          propertyId, 
          selectedUnit.id, 
          unitForm as UpdateUnitRequest
        );
      } else {
        // Adding new unit
        await unitService.createUnit(
          propertyId, 
          unitForm as CreateUnitRequest
        );
      }

      // Close modal and reset form
      setIsAddEditModalOpen(false);
      setSelectedUnit(null);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to save unit';
      setError(errorMessage);
    }
  };

  // Handle unit deletion
  const handleDeleteUnit = async (unitId: string) => {
    try {
      await unitService.deleteUnit(propertyId, unitId);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to delete unit';
      setError(errorMessage);
    }
  };

  // Open image manager for a specific unit
  const handleManageImages = (unitId: string) => {
    setSelectedUnit(prev => prev && prev.id === unitId ? prev : { id: unitId } as Unit);
    setIsImageManagerOpen(true);
  };

  // Close image manager
  const handleCloseImageManager = () => {
    setIsImageManagerOpen(false);
    setSelectedUnit(null);
  };

  // Close add/edit modal
  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setSelectedUnit(null);
    setError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Units Management
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />}
        onClick={handleAddUnit}
        sx={{ mb: 2 }}
      >
        Add New Unit
      </Button>

      <UnitList 
        propertyId={propertyId}
        onAddUnit={handleAddUnit}
        onEditUnit={handleEditUnit}
        onDeleteUnit={handleDeleteUnit}
        onManageImages={handleManageImages}
      />

      {/* Add/Edit Unit Modal */}
      <Dialog 
        open={isAddEditModalOpen} 
        onClose={handleCloseAddEditModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedUnit ? 'Edit Unit' : 'Add New Unit'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2, 
            pt: 2 
          }}>
            <TextField
              fullWidth
              label="Unit Number"
              name="unitNumber"
              value={unitForm.unitNumber}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              gap: 2 
            }}>
              <TextField
                fullWidth
                label="Size (sq ft)"
                name="size"
                type="number"
                value={unitForm.size}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Market Rent"
                name="marketRent"
                type="number"
                value={unitForm.marketRent}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              gap: 2 
            }}>
              <TextField
                fullWidth
                label="Bedrooms"
                name="bedrooms"
                type="number"
                value={unitForm.bedrooms}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Bathrooms"
                name="bathrooms"
                type="number"
                value={unitForm.bathrooms}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={unitForm.isOccupied}
                  onChange={handleInputChange}
                  name="isOccupied"
                />
              }
              label="Is Occupied"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddEditModal}>Cancel</Button>
          <Button 
            onClick={handleSubmitUnit} 
            color="primary" 
            variant="contained"
          >
            {selectedUnit ? 'Update' : 'Add'} Unit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Manager Modal */}
      {selectedUnit && (
        <ImageManager 
          propertyId={propertyId}
          unitId={selectedUnit.id}
          open={isImageManagerOpen}
          onClose={handleCloseImageManager}
        />
      )}
    </Container>
  );
};

export default UnitManager;