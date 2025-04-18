import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  SelectChangeEvent
} from '@mui/material';
import { 
  UploadFile as UploadIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { CreateTaxDocumentRequest } from '../../services/taxDocumentService';
import documentService, { Document, CreateDocumentRequest } from '../../services/documentService';

interface TaxDocumentUploadFormProps {
  propertyId: string;
  taxYear: number;
  onUpload: (documentData: CreateTaxDocumentRequest, file: File) => Promise<void>;
  onClose?: () => void;
  isUploading: boolean;
  error: string | null;
}

const TaxDocumentUploadForm: React.FC<TaxDocumentUploadFormProps> = ({
  propertyId,
  taxYear,
  onUpload,
  onClose,
  isUploading,
  error
}) => {
  const [documentType, setDocumentType] = useState<string>('');
  const [description, setDescription] = useState<string>("No description provided");
  const [category, setCategory] = useState<string>('Income');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [unitId, setUnitId] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);

  const documentTypeOptions = [
    'W-2',
    'W-9',
    '1099-MISC',
    '1099-NEC',
    '1098',
    'Schedule E',
    'K-1',
    'Receipt',
    'Invoice',
    'Tax Return',
    'Property Tax Bill',
    'Other'
  ];

  const categoryOptions = [
    'Income',
    'Expense',
    'Deduction',
    'Credit',
    'Tax Form',
    'Property Tax',
    'Insurance',
    'Mortgage',
    'Receipt',
    'Other'
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setDocumentType(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      return;
    }
    
    // Create an object that matches the expected CreateTaxDocumentRequest type
    const documentData: CreateTaxDocumentRequest = {
      propertyId,
      taxYear: new Date().getFullYear(), // Set current year
      documentType: documentType || 'Other',
      description: description || 'No description provided',
      category: 'Other' // Set a default category
    };
    
    await onUpload(documentData, selectedFile);
  };

  return (
    <Paper sx={{ p: 3, position: 'relative' }}>
      {onClose && (
        <IconButton 
          sx={{ position: 'absolute', top: 8, right: 8 }} 
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      )}
      
      <Typography variant="h6" gutterBottom>
        Upload Tax Document
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv"
          />
          
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={handleSelectFile}
            fullWidth
            sx={{ p: 2, border: '1px dashed', height: 100, display: 'flex', flexDirection: 'column' }}
          >
            {fileName ? (
              <>
                <Typography variant="body2">{fileName}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Click to change file
                </Typography>
              </>
            ) : (
              <>
                <Typography>Select File</Typography>
                <Typography variant="caption" color="textSecondary">
                  PDF, Word, Excel, Images
                </Typography>
              </>
            )}
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <FormControl fullWidth sx={{ flex: '1 1 200px' }}>
            <InputLabel id="document-type-label">Document Type</InputLabel>
            <Select
              labelId="document-type-label"
              id="document-type"
              value={documentType}
              label="Document Type"
              onChange={handleTypeChange}
              required
            >
              {documentTypeOptions.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ flex: '1 1 200px' }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={category}
              label="Category"
              onChange={handleCategoryChange}
              required
            >
              {categoryOptions.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value || "No description provided")} // Never allow empty
          placeholder="Enter a description (optional)"
          sx={{ mb: 3 }}
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!selectedFile || isUploading}
          fullWidth
        >
          {isUploading ? <CircularProgress size={24} /> : 'Upload Document'}
        </Button>
      </Box>
    </Paper>
  );
};

export default TaxDocumentUploadForm;