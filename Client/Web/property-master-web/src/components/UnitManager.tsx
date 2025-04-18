import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Paper, 
  Box,
  Alert,
  DialogActions,
  Button,
  DialogContentText,
  Typography
} from '@mui/material';
import UnitList from './UnitList';
import UnitForm from './UnitForm';
import UnitImageUploader from '../components/units/UnitImageUploader';
import unitService, { Unit, CreateUnitRequest, UpdateUnitRequest } from '../services/unitService';

interface UnitManagerProps {
  propertyId: string;
}

enum DialogMode {
  NONE,
  ADD,
  EDIT,
  DELETE,
  IMAGES
}

const UnitManager: React.FC<UnitManagerProps> = ({ propertyId }) => {
  const [dialogMode, setDialogMode] = useState<DialogMode>(DialogMode.NONE);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleAddUnit = () => {
    setDialogMode(DialogMode.ADD);
  };

  const handleEditUnit = async (unitId: string) => {
    try {
      const unit = await unitService.getUnit(propertyId, unitId);
      setSelectedUnit(unit);
      setDialogMode(DialogMode.EDIT);
    } catch (err) {
      setError('Failed to load unit information. Please try again.');
    }
  };

  const handleManageImages = async (unitId: string) => {
    try {
      const unit = await unitService.getUnit(propertyId, unitId);
      setSelectedUnit(unit);
      setDialogMode(DialogMode.IMAGES);
    } catch (err) {
      setError('Failed to load unit information. Please try again.');
    }
  };

  const handleDeleteUnit = (unitId: string) => {
    setSelectedUnit((prev) => ({ ...prev, id: unitId } as Unit));
    setDialogMode(DialogMode.DELETE);
  };

  const handleCreateUnit = async (values: CreateUnitRequest) => {
    try {
      await unitService.createUnit(propertyId, values);
      setDialogMode(DialogMode.NONE);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setError('Failed to create unit. Please try again.');
    }
  };

  const handleUpdateUnit = async (values: UpdateUnitRequest) => {
    try {
      if (selectedUnit) {
        await unitService.updateUnit(propertyId, selectedUnit.id, values);
        setDialogMode(DialogMode.NONE);
        setSelectedUnit(null);
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err) {
      setError('Failed to update unit. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedUnit) {
        await unitService.deleteUnit(propertyId, selectedUnit.id);
        setDialogMode(DialogMode.NONE);
        setSelectedUnit(null);
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err) {
      setError('Failed to delete unit. Please try again.');
    }
  };

  const handleCloseDialog = () => {
    setDialogMode(DialogMode.NONE);
    setSelectedUnit(null);
    setError(null);
  };

  const handleFormSubmit = (values: CreateUnitRequest | UpdateUnitRequest) => {
    if (dialogMode === DialogMode.ADD) {
      handleCreateUnit(values as CreateUnitRequest);
    } else {
      handleUpdateUnit(values as UpdateUnitRequest);
    }
  };

  // Force refresh of unit list when units are modified
  const key = `property-${propertyId}-units-${refreshTrigger}`;

  return (
    <div>
      <UnitList 
        key={key}
        propertyId={propertyId}
        onAddUnit={handleAddUnit}
        onEditUnit={handleEditUnit}
        onDeleteUnit={handleDeleteUnit}
        onManageImages={handleManageImages}
      />

      {/* Add/Edit Unit Dialog */}
      <Dialog 
        open={dialogMode === DialogMode.ADD || dialogMode === DialogMode.EDIT} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === DialogMode.ADD ? 'Add New Unit' : 'Edit Unit'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Box mb={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          <UnitForm 
            initialValues={selectedUnit || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseDialog}
            isEditing={dialogMode === DialogMode.EDIT}
          />
        </DialogContent>
      </Dialog>

      {/* Image Management Dialog */}
      <Dialog 
        open={dialogMode === DialogMode.IMAGES} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Manage Unit Images for Unit: {selectedUnit?.unitNumber}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Box mb={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {selectedUnit && (
            <Box>
              <UnitImageUploader 
                propertyId={propertyId}
                unitId={selectedUnit.id}
                onImagesUploaded={() => {
                  // Optional: add any additional logic after image upload
                  setRefreshTrigger(prev => prev + 1);
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogMode === DialogMode.DELETE}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Unit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this unit? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UnitManager;