// src/components/documents/DocumentList.tsx
import React, { useState } from 'react';
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
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  GetApp as DownloadIcon,
  MoreVert as MoreIcon,
  Add as AddIcon,
  Description as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  TableChart as SpreadsheetIcon,
  TextSnippet as TextIcon
} from '@mui/icons-material';
import { Document } from '../../services/documentService';

interface DocumentListProps {
  documents: Document[];
  onAddDocument: () => void;
  onEditDocument: (document: Document) => void;
  onDeleteDocument: (document: Document) => void;
  onDownloadDocument: (document: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onAddDocument,
  onEditDocument,
  onDeleteDocument,
  onDownloadDocument
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.includes('image')) {
      return <ImageIcon />;
    } else if (contentType.includes('pdf')) {
      return <PdfIcon />;
    } else if (contentType.includes('excel') || contentType.includes('spreadsheet')) {
      return <SpreadsheetIcon />;
    } else if (contentType.includes('text')) {
      return <TextIcon />;
    } else {
      return <FileIcon />;
    }
  };

  const getDocumentTypeColor = (documentType?: string) => {
    switch (documentType?.toLowerCase()) {
      case 'lease':
        return 'primary';
      case 'inspection':
        return 'secondary';
      case 'insurance':
        return 'success';
      case 'legal':
        return 'error';
      case 'financial':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Documents ({documents.length})
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />}
          onClick={onAddDocument}
        >
          Add Document
        </Button>
      </Box>
      
      {documents.length === 0 ? (
        <Typography variant="body1">
          No documents found. Click "Add Document" to upload your first document.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>File</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell>Expiration</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {getFileIcon(document.contentType)}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {document.fileName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={document.documentType || 'General'} 
                      size="small"
                      color={getDocumentTypeColor(document.documentType)}
                    />
                  </TableCell>
                  <TableCell>{document.description || 'No description'}</TableCell>
                  <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                  <TableCell>{formatDate(document.uploadDate)}</TableCell>
                  <TableCell>
                    {document.expirationDate ? (
                      <Chip 
                        label={formatDate(document.expirationDate)} 
                        size="small"
                        color={new Date(document.expirationDate) < new Date() ? 'error' : 'default'}
                      />
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Download">
                      <IconButton 
                        size="small"
                        onClick={() => onDownloadDocument(document)}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small"
                        onClick={() => onEditDocument(document)}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => onDeleteDocument(document)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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

export default DocumentList;