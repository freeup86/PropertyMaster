import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, Dialog } from '@mui/material';
import TaxDocumentList from './TaxDocumentList';
import TaxDocumentUploadForm from './TaxDocumentUploadForm';
import taxDocumentService, { 
  TaxDocument, 
  CreateTaxDocumentRequest 
} from '../../services/taxDocumentService';

interface TaxDocumentsManagerProps {
  propertyId: string;
  taxYear: number;
}

const TaxDocumentsManager: React.FC<TaxDocumentsManagerProps> = ({
  propertyId,
  taxYear
}) => {
  const [documents, setDocuments] = useState<TaxDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const docs = await taxDocumentService.getTaxDocumentsByProperty(propertyId, taxYear);
      setDocuments(docs);
    } catch (err) {
      console.error('Error fetching tax documents:', err);
      setError('Failed to load tax documents. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId && taxYear) {
      fetchDocuments();
    }
  }, [propertyId, taxYear]);

  const handleUploadDocument = async (documentData: CreateTaxDocumentRequest, file: File) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      await taxDocumentService.uploadTaxDocument(documentData, file);
      await fetchDocuments();
      setUploadDialogOpen(false);
    } catch (err) {
      console.error('Error uploading tax document:', err);
      setUploadError('Failed to upload document. Please try again later.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await taxDocumentService.deleteTaxDocument(documentId);
      await fetchDocuments();
    } catch (err) {
      console.error('Error deleting tax document:', err);
      setError('Failed to delete document. Please try again later.');
    }
  };

  const handleDownloadDocument = (document: TaxDocument) => {
    const downloadUrl = taxDocumentService.getDownloadUrl(document.id);
    window.open(downloadUrl, '_blank');
  };

  return (
    <Box>
      <TaxDocumentList
        documents={documents}
        onDownload={handleDownloadDocument}
        onDelete={handleDeleteDocument}
        onAddDocument={() => setUploadDialogOpen(true)}
        loading={loading}
        error={error}
      />
      
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <TaxDocumentUploadForm
          propertyId={propertyId}
          taxYear={taxYear}
          onUpload={handleUploadDocument}
          onClose={() => setUploadDialogOpen(false)}
          isUploading={isUploading}
          error={uploadError}
        />
      </Dialog>
    </Box>
  );
};

export default TaxDocumentsManager;