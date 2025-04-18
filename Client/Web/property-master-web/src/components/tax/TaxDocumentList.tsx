import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Link,
  Tooltip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Add as AddIcon,
  InsertDriveFile as FileIcon,
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
  Assignment as FormIcon
} from '@mui/icons-material';
import { TaxDocument } from '../../services/taxDocumentService';

interface TaxDocumentListProps {
  documents: TaxDocument[];
  onDownload: (document: TaxDocument) => void;
  onDelete: (documentId: string) => Promise<void>;
  onAddDocument: () => void;
  loading: boolean;
  error: string | null;
}

const TaxDocumentList: React.FC<TaxDocumentListProps> = ({
  documents,
  onDownload,
  onDelete,
  onAddDocument,
  loading,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const filteredDocuments = documents.filter(doc => 
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleConfirmDelete = async () => {
    if (confirmDeleteId) {
      await onDelete(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };
  
  const getDocumentIcon = (document: TaxDocument) => {
    switch (document.category.toLowerCase()) {
      case 'receipt':
        return <ReceiptIcon />;
      case 'tax form':
        return <FormIcon />;
      default:
        return <FileIcon />;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'income':
        return 'success';
      case 'expense':
        return 'error';
      case 'deduction':
        return 'info';
      case 'credit':
        return 'secondary';
      case 'tax form':
        return 'primary';
      default:
        return 'default';
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Tax Documents</Typography>
        <Button 
          startIcon={<AddIcon />} 
          variant="contained"
          onClick={onAddDocument}
        >
          Upload Document
        </Button>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : filteredDocuments.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            {searchTerm ? 'No documents found matching your search' : 'No tax documents uploaded yet'}
          </Typography>
          {!searchTerm && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onAddDocument}
              sx={{ mt: 2 }}
            >
              Upload Your First Document
            </Button>
          )}
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Document</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tax Year</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getDocumentIcon(document)}
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {document.fileName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(document.fileSize)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{document.documentType.split('|')[0].trim()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={document.category} 
                      size="small"
                      color={getCategoryColor(document.category)}
                    />
                  </TableCell>
                  <TableCell>{document.taxYear}</TableCell>
                  <TableCell>{formatDate(document.uploadDate)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Download">
                      <IconButton onClick={() => onDownload(document)}>
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => setConfirmDeleteId(document.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
      >
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this document? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TaxDocumentList;