import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  IconButton, 
  Box,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import tenantService, { Tenant } from '../services/tenantService';

interface TenantListProps {
  propertyId: string;
  unitId?: string;
  onAddTenant: () => void;
  onEditTenant: (tenantId: string) => void;
  onDeleteTenant: (tenantId: string) => void;
}

const TenantList: React.FC<TenantListProps> = ({
  propertyId,
  unitId,
  onAddTenant,
  onEditTenant,
  onDeleteTenant
}) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        let data: Tenant[];
        
        if (unitId) {
          data = await tenantService.getTenantsByUnit(unitId);
        } else {
          data = await tenantService.getTenantsByProperty(propertyId);
        }
        
        // Sort tenants by full name in ascending order
        const sortedTenants = data.sort((a, b) => {
          // Combine first and last name for sorting
          const getFullName = (tenant: Tenant) => 
            `${tenant.lastName.toLowerCase()} ${tenant.firstName.toLowerCase()}`;
          
          return getFullName(a).localeCompare(getFullName(b));
        });

        setTenants(sortedTenants);
        setLoading(false);
      } catch (err) {
        setError('Failed to load tenants. Please try again later.');
        setLoading(false);
      }
    };

    fetchTenants();
  }, [propertyId, unitId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Tenants ({tenants.length})
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />}
          onClick={onAddTenant}
        >
          Add Tenant
        </Button>
      </Box>
      
      {tenants.length === 0 ? (
        <Typography variant="body1">
          No tenants found. Add a tenant to get started.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                {!unitId && <TableCell>Unit</TableCell>}
                <TableCell>Lease Start</TableCell>
                <TableCell>Lease End</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>{tenant.lastName}, {tenant.firstName}</TableCell>
                  <TableCell>
                    {tenant.email && <div>{tenant.email}</div>}
                    {tenant.phoneNumber && <div>{tenant.phoneNumber}</div>}
                  </TableCell>
                  {!unitId && <TableCell>Unit {tenant.unitNumber}</TableCell>}
                  <TableCell>{formatDate(tenant.leaseStartDate)}</TableCell>
                  <TableCell>{formatDate(tenant.leaseEndDate)}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => onEditTenant(tenant.id)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => onDeleteTenant(tenant.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TenantList;