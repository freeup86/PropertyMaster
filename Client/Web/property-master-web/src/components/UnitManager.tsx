import React, { useState, useCallback, useEffect, useRef } from 'react';
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
 import AddIcon from '@mui/icons-material/Add';
 
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
 
  const handleAddUnit = useCallback(() => {
    console.log('UnitManager - handleAddUnit called');
    setDialogMode(DialogMode.ADD);
  }, []);
 
  const handleEditUnit = useCallback(async (unitId: string) => {
    console.log('UnitManager - handleEditUnit called for unitId:', unitId);
    try {
      const unit = await unitService.getUnit(propertyId, unitId);
      setSelectedUnit(unit);
      setDialogMode(DialogMode.EDIT);
    } catch (err: any) {
      setError('Failed to load unit information. Please try again.');
      console.error('UnitManager - handleEditUnit error:', err);
    }
  }, [propertyId, unitService]);
 
  const handleManageImages = useCallback(async (unitId: string) => {
    console.log('UnitManager - handleManageImages called for unitId:', unitId);
    try {
      const unit = await unitService.getUnit(propertyId, unitId);
      setSelectedUnit(unit);
      setDialogMode(DialogMode.IMAGES);
    } catch (err: any) {
      setError('Failed to load unit information. Please try again.');
      console.error('UnitManager - handleManageImages error:', err);
    }
  }, [propertyId, unitService]);
 
  const handleDeleteUnit = useCallback((unitId: string) => {
    console.log('UnitManager - handleDeleteUnit called for unitId:', unitId);
    setSelectedUnit((prev) => ({ ...prev, id: unitId } as Unit));
    setDialogMode(DialogMode.DELETE);
  }, []);
 
  const handleCreateUnit = useCallback(async (values: CreateUnitRequest) => {
    console.log('UnitManager - handleCreateUnit called with values:', values);
    try {
      await unitService.createUnit(propertyId, values);
      setDialogMode(DialogMode.NONE);
      setRefreshTrigger(prev => prev + 1);
      console.log('UnitManager - handleCreateUnit success');
    } catch (err: any) {
      setError('Failed to create unit. Please try again.');
      console.error('UnitManager - handleCreateUnit error:', err);
    }
  }, [propertyId]);
 
  const handleUpdateUnit = useCallback(async (values: UpdateUnitRequest) => {
    console.log('UnitManager - handleUpdateUnit called with values:', values);
    try {
      if (selectedUnit) {
        await unitService.updateUnit(propertyId, selectedUnit.id, values);
        setDialogMode(DialogMode.NONE);
        setSelectedUnit(null);
        setRefreshTrigger(prev => prev + 1);
        console.log('UnitManager - handleUpdateUnit success');
      }
    } catch (err: any) {
      setError('Failed to update unit. Please try again.');
      console.error('UnitManager - handleUpdateUnit error:', err);
    }
  }, [propertyId, selectedUnit]);
 
  const handleConfirmDelete = useCallback(async () => {
    console.log('UnitManager - handleConfirmDelete called');
    try {
      if (selectedUnit) {
        await unitService.deleteUnit(propertyId, selectedUnit.id);
        setDialogMode(DialogMode.NONE);
        setSelectedUnit(null);
        setRefreshTrigger(prev => prev + 1);
        console.log('UnitManager - handleConfirmDelete success');
      }
    } catch (err: any) {
      setError('Failed to delete unit. Please try again.');
      console.error('UnitManager - handleConfirmDelete error:', err);
    }
  }, [propertyId, selectedUnit]);
 
  const handleCloseDialog = useCallback(() => {
    console.log('UnitManager - handleCloseDialog called');
    setDialogMode(DialogMode.NONE);
    setSelectedUnit(null);
    setError(null);
  }, []);
 
  const handleFormSubmit = useCallback((values: CreateUnitRequest | UpdateUnitRequest) => {
    console.log('UnitManager - handleFormSubmit called with values:', values);
    if (dialogMode === DialogMode.ADD) {
      handleCreateUnit(values as CreateUnitRequest);
    } else {
      handleUpdateUnit(values as UpdateUnitRequest);
    }
  }, [dialogMode, handleCreateUnit, handleUpdateUnit]);
 
  // Force refresh of unit list when units are modified
  const key = `property-${propertyId}-units-${refreshTrigger}`;
 
  return (
    <div>
      <Box sx={{ position: 'relative', height: '60px', left:25}}>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />}
        onClick={handleAddUnit}
        sx={{ mb: 2 }}
      >
        Add New Unit
      </Button>
      </Box>
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
          Manage Images for Unit: {selectedUnit?.unitNumber}
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