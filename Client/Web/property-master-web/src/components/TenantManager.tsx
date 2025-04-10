import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Paper, 
  Box,
  Alert,
  DialogActions,
  Button,
  DialogContentText
} from '@mui/material';
import TenantList from './TenantList';
import TenantForm from './TenantForm';
import tenantService, { Tenant, CreateTenantRequest, UpdateTenantRequest } from '../services/tenantService';
import unitService, { Unit } from '../services/unitService';

interface TenantManagerProps {
  propertyId: string;
  unitId?: string;
}

enum DialogMode {
  NONE,
  ADD,
  EDIT,
  DELETE
}

const TenantManager: React.FC<TenantManagerProps> = ({ propertyId, unitId }) => {
  const [dialogMode, setDialogMode] = useState<DialogMode>(DialogMode.NONE);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const unitsData = await unitService.getUnits(propertyId);
        setUnits(unitsData);
      } catch (err) {
        setError('Failed to load units. Some features may be limited.');
      }
    };

    fetchUnits();
  }, [propertyId]);

  const handleAddTenant = () => {
    setDialogMode(DialogMode.ADD);
  };

  const handleEditTenant = async (tenantId: string) => {
    try {
      const tenant = await tenantService.getTenant(tenantId);
      setSelectedTenant(tenant);
      setDialogMode(DialogMode.EDIT);
    } catch (err) {
      setError('Failed to load tenant information. Please try again.');
    }
  };

  const handleDeleteTenant = (tenantId: string) => {
    setSelectedTenant((prev) => ({ ...prev, id: tenantId } as Tenant));
    setDialogMode(DialogMode.DELETE);
  };

  const handleCreateTenant = async (values: CreateTenantRequest) => {
    try {
      await tenantService.createTenant(values);
      setDialogMode(DialogMode.NONE);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setError('Failed to create tenant. Please try again.');
    }
  };

  const handleUpdateTenant = async (values: UpdateTenantRequest) => {
    try {
      if (selectedTenant) {
        await tenantService.updateTenant(selectedTenant.id, values);
        setDialogMode(DialogMode.NONE);
        setSelectedTenant(null);
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err) {
      setError('Failed to update tenant. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedTenant) {
        await tenantService.deleteTenant(selectedTenant.id);
        setDialogMode(DialogMode.NONE);
        setSelectedTenant(null);
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err) {
      setError('Failed to delete tenant. Please try again.');
    }
  };

  const handleCloseDialog = () => {
    setDialogMode(DialogMode.NONE);
    setSelectedTenant(null);
    setError(null);
  };

  // Force refresh of tenant list when tenants are modified
  const key = `property-${propertyId}-${unitId || 'all'}-tenants-${refreshTrigger}`;

  return (
    <div>
      <TenantList 
        key={key}
        propertyId={propertyId}
        unitId={unitId}
        onAddTenant={handleAddTenant}
        onEditTenant={handleEditTenant}
        onDeleteTenant={handleDeleteTenant}
      />

      {/* Add/Edit Tenant Dialog */}
      <Dialog 
        open={dialogMode === DialogMode.ADD || dialogMode === DialogMode.EDIT} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === DialogMode.ADD ? 'Add New Tenant' : 'Edit Tenant'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Box mb={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          <TenantForm 
            initialValues={selectedTenant || undefined}
            units={units}
            unitId={unitId}
            onSubmit={(values) => 
              dialogMode === DialogMode.ADD 
                ? handleCreateTenant(values as CreateTenantRequest) 
                : handleUpdateTenant(values as UpdateTenantRequest)
            }
            onCancel={handleCloseDialog}
            isEditing={dialogMode === DialogMode.EDIT}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogMode === DialogMode.DELETE}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Tenant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this tenant? This action cannot be undone.
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

export default TenantManager;