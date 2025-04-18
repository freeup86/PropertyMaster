// src/components/documents/DocumentManager.tsx
import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import DocumentList from './DocumentList';
import DocumentForm from './DocumentForm';
import documentService, { Document, CreateDocumentRequest, UpdateDocumentRequest } from '../../services/documentService';

interface DocumentManagerProps {
  propertyId: string;
  unitId?: string;
  tenantId?: string;
  title?: string;
}

enum DialogMode {
  NONE,
  ADD,
  EDIT,
  DELETE
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  propertyId,
  unitId,
  tenantId,
  title = ''// title = 'Documents'
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>(DialogMode.NONE);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      let documentsData: Document[];

      if (tenantId) {
        documentsData = await documentService.getDocumentsByTenant(tenantId);
      } else if (unitId) {
        documentsData = await documentService.getDocumentsByUnit(unitId);
      } else {
        documentsData = await documentService.getDocumentsByProperty(propertyId);
      }

      setDocuments(documentsData);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [propertyId, unitId, tenantId]);

  const handleAddDocument = () => {
    setSelectedDocument(null);
    setDialogMode(DialogMode.ADD);
  };

  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document);
    setDialogMode(DialogMode.EDIT);
  };

  const handleDeleteDocument = (document: Document) => {
    setSelectedDocument(document);
    setDialogMode(DialogMode.DELETE);
  };

  const handleDownloadDocument = (document: Document) => {
    // Create a link element and simulate a click to download the document
    const downloadUrl = documentService.getDownloadUrl(document.id);
    const link = window.document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', document.fileName);
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleFormSubmit = async (
    values: CreateDocumentRequest | UpdateDocumentRequest, 
    file?: File
  ) => {
    try {
      if (dialogMode === DialogMode.ADD && file) {
        await documentService.uploadDocument(values as CreateDocumentRequest, file);
      } else if (dialogMode === DialogMode.EDIT && selectedDocument) {
        await documentService.updateDocument(selectedDocument.id, values as UpdateDocumentRequest);
      }

      setDialogMode(DialogMode.NONE);
      fetchDocuments();
    } catch (err: any) {
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedDocument) {
        await documentService.deleteDocument(selectedDocument.id);
        setDialogMode(DialogMode.NONE);
        fetchDocuments();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete document. Please try again.');
    }
  };

  const handleCloseDialog = () => {
    setDialogMode(DialogMode.NONE);
    setSelectedDocument(null);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      ) : (
        <DocumentList
          documents={documents}
          onAddDocument={handleAddDocument}
          onEditDocument={handleEditDocument}
          onDeleteDocument={handleDeleteDocument}
          onDownloadDocument={handleDownloadDocument}
        />
      )}

      {/* Add/Edit Document Dialog */}
      <Dialog
        open={dialogMode === DialogMode.ADD || dialogMode === DialogMode.EDIT}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === DialogMode.ADD ? 'Upload New Document' : 'Edit Document'}
        </DialogTitle>
        <DialogContent>
          <DocumentForm
            propertyId={propertyId}
            unitId={unitId}
            tenantId={tenantId}
            initialValues={selectedDocument || undefined}
            onSubmit={handleFormSubmit}
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
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedDocument?.fileName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DocumentManager;