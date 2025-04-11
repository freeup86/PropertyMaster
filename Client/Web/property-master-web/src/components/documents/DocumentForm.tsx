import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { UploadFile as UploadIcon, Clear as ClearIcon } from '@mui/icons-material';
import { CreateDocumentRequest, Document, UpdateDocumentRequest } from '../../services/documentService';
import dayjs, { Dayjs } from 'dayjs';

interface DocumentFormProps {
  propertyId: string;
  unitId?: string;
  tenantId?: string;
  initialValues?: Document;
  onSubmit: (values: CreateDocumentRequest | UpdateDocumentRequest, file?: File) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

const DocumentForm: React.FC<DocumentFormProps> = ({
  propertyId,
  unitId,
  tenantId,
  initialValues,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const documentTypes = [
    { value: 'Lease', label: 'Lease Agreement' },
    { value: 'Inspection', label: 'Inspection Report' },
    { value: 'Insurance', label: 'Insurance Document' },
    { value: 'Legal', label: 'Legal Document' },
    { value: 'Financial', label: 'Financial Document' },
    { value: 'Maintenance', label: 'Maintenance Record' },
    { value: 'Other', label: 'Other Document' }
  ];

  const validationSchema = Yup.object({
    documentType: Yup.string(),
    description: Yup.string().max(500, 'Description must be 500 characters or less'),
    expirationDate: Yup.string().nullable()
  });

  const formInitialValues = initialValues ? {
    documentType: initialValues.documentType || '',
    description: initialValues.description || '',
    expirationDate: initialValues.expirationDate 
      ? dayjs(initialValues.expirationDate) 
      : null
  } : {
    documentType: '',
    description: '',
    expirationDate: null
  };  

  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setError(null);
        setLoading(true);

        if (isEditing) {
          // Convert Dayjs to ISO string or handle undefined
          const updateValues: UpdateDocumentRequest = {
            documentType: values.documentType,
            description: values.description,
            expirationDate: values.expirationDate 
              ? dayjs(values.expirationDate).toISOString() 
              : undefined,
          };
        
          await onSubmit(updateValues);
        } else {
          // For new document, ensure we have a file
          if (!selectedFile) {
            setError('Please select a file to upload');
            setLoading(false);
            return;
          }

          const documentData: CreateDocumentRequest = {
            propertyId,
            unitId,
            tenantId,
            ...values,
            expirationDate: values.expirationDate ? dayjs(values.expirationDate).toISOString() : undefined,
          };

          await onSubmit(documentData, selectedFile);
        }

        setLoading(false);
        onCancel();
      } catch (err: any) {
        setError(err.message || 'Failed to submit document. Please try again.');
        setLoading(false);
      }
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    // Reset the file input by creating a new ref
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="document-type-label">Document Type</InputLabel>
          <Select
            labelId="document-type-label"
            id="documentType"
            name="documentType"
            value={formik.values.documentType}
            onChange={formik.handleChange}
            label="Document Type"
            error={formik.touched.documentType && Boolean(formik.errors.documentType)}
          >
            {documentTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.documentType && formik.errors.documentType && (
            <FormHelperText error>
              {typeof formik.errors.documentType === 'string' ? formik.errors.documentType : String(formik.errors.documentType)}
            </FormHelperText>
          )}
        </FormControl>

        <TextField
          fullWidth
          id="description"
          name="description"
          label="Description"
          multiline
          rows={3}
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
          sx={{ mb: 2 }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Expiration Date (Optional)"
            value={formik.values.expirationDate}
            onChange={(date: Dayjs | null) => {
              formik.setFieldValue('expirationDate', date);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: formik.touched.expirationDate && Boolean(formik.errors.expirationDate),
                helperText: formik.touched.expirationDate && formik.errors.expirationDate,
              },
            }}
          />
        </LocalizationProvider>
      </Box>

      {!isEditing && (
        <Paper
          sx={{
            p: 2,
            mb: 3,
            border: '1px dashed #ccc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 150
          }}
        >
          {selectedFile ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Selected File</Typography>
              <Typography variant="body1">{selectedFile.name}</Typography>
              <Typography variant="body2">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<ClearIcon />}
                onClick={clearFileSelection}
                sx={{ mt: 1 }}
              >
                Clear Selection
              </Button>
            </Box>
          ) : (
            <>
              <input
                id="file-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadIcon />}
                >
                  Select File
                </Button>
              </label>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Drag and drop a file here, or click to select a file
              </Typography>
            </>
          )}
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          disabled={loading || (!selectedFile && !isEditing)}
          sx={{ position: 'relative' }}
        >
          {isEditing ? 'Update Document' : 'Upload Document'}
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentForm;