import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  IconButton, 
  Box,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  TablePagination,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Build as BuildIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import MaintenanceRequestService from '../services/maintenanceRequestService';
import { MaintenanceRequestDto } from '../types/MaintenanceRequestTypes';

interface MaintenanceRequestListProps {
    propertyId?: string;
    unitId?: string;
}

const MaintenanceRequestList: React.FC<MaintenanceRequestListProps> = ({ propertyId, unitId }) => {
    const [requests, setRequests] = useState<MaintenanceRequestDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchRequests();
    }, [propertyId, unitId]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            let fetchedRequests;
            
            if (propertyId) {
                fetchedRequests = await MaintenanceRequestService.getRequestsByProperty(propertyId);
            } else if (unitId) {
                fetchedRequests = await MaintenanceRequestService.getRequestsByUnit(unitId);
            } else {
                fetchedRequests = await MaintenanceRequestService.getAllRequests();
            }
            
            setRequests(fetchedRequests);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching maintenance requests:', error);
            setError('Failed to load maintenance requests. Please try again.');
            setLoading(false);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
                return 'success';
            default:
                return 'default';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'open':
                return 'primary';
            case 'in progress':
                return 'warning';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" my={5}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ my: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Maintenance Requests
                </Typography>
                <Box>
                    <Button 
                        variant="outlined" 
                        startIcon={<RefreshIcon />} 
                        onClick={fetchRequests}
                        size="small"
                        sx={{ mr: 1 }}
                    >
                        Refresh
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={() => window.location.href = '/maintenance-requests/create'}
                        size="small"
                    >
                        New Request
                    </Button>
                </Box>
            </Box>

            {requests.length === 0 ? (
                <Card variant="outlined" sx={{ mb: 3, bgcolor: 'background.default' }}>
                    <CardContent sx={{ textAlign: 'center', py: 5 }}>
                        <BuildIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            No Maintenance Requests Found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Create your first maintenance request by clicking the "New Request" button above.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {isMobile ? (
                        // Mobile card view
                        <Box>
                            {requests
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((request) => (
                                <Card key={request.id} sx={{ mb: 2, boxShadow: 2 }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Chip 
                                                label={request.status}
                                                color={getStatusColor(request.status)}
                                                size="small"
                                            />
                                            <Chip 
                                                label={request.priority}
                                                color={getPriorityColor(request.priority)}
                                                size="small"
                                            />
                                        </Box>
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            {request.category}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Unit: {request.unitNumber} | Date: {formatDate(request.requestDate)}
                                        </Typography>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="body2" paragraph>
                                            {request.description.length > 100 
                                                ? `${request.description.substring(0, 100)}...` 
                                                : request.description}
                                        </Typography>
                                        <Box display="flex" justifyContent="flex-end">
                                            <IconButton 
                                                size="small"
                                                onClick={() => window.location.href = `/maintenance-requests/${request.id}`}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    ) : (
                        // Desktop table view
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: 'background.default' }}>
                                    <TableRow>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Priority</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Unit</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requests
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((request) => (
                                        <TableRow key={request.id} hover>
                                            <TableCell>
                                                <Chip 
                                                    label={request.status}
                                                    color={getStatusColor(request.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={request.priority}
                                                    color={getPriorityColor(request.priority)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{request.category}</TableCell>
                                            <TableCell>{request.unitNumber}</TableCell>
                                            <TableCell>{formatDate(request.requestDate)}</TableCell>
                                            <TableCell>
                                                {request.description.length > 50 
                                                    ? `${request.description.substring(0, 50)}...` 
                                                    : request.description}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton 
                                                    size="small"
                                                    onClick={() => window.location.href = `/maintenance-requests/${request.id}`}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton 
                                                    size="small" 
                                                    color="error"
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this request?')) {
                                                            // Add delete functionality
                                                        }
                                                    }}
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
                    
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={requests.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )}
        </Paper>
    );
};

export default MaintenanceRequestList;