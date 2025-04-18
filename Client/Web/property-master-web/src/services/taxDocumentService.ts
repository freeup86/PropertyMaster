import api from './api';

export interface TaxDocument {
  id: string;
  propertyId: string;
  propertyName: string;
  taxYear: number;
  documentType: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  description: string;
  uploadDate: string;
  category: string;
}

export interface CreateTaxDocumentRequest {
  propertyId: string;
  taxYear: number;
  documentType: string;
  description: string;
  category: string;
}

export interface UpdateTaxDocumentRequest {
  documentType?: string;
  description?: string;
  category?: string;
}

const taxDocumentService = {
  getTaxDocumentsByProperty: async (propertyId: string, taxYear?: number): Promise<TaxDocument[]> => {
    let url = `/tax-documents/property/${propertyId}`;
    if (taxYear) {
      url += `?taxYear=${taxYear}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  getTaxDocument: async (id: string): Promise<TaxDocument> => {
    const response = await api.get(`/tax-documents/${id}`);
    return response.data;
  },

  uploadTaxDocument: async (documentData: CreateTaxDocumentRequest, file: File): Promise<TaxDocument> => {
    const formData = new FormData();
    
    // Append document data
    formData.append('propertyId', documentData.propertyId);
    formData.append('taxYear', documentData.taxYear.toString());
    formData.append('documentType', documentData.documentType);
    
    // Always include description, even if empty
    const description = documentData.description || " "; // Use a space instead of empty string
    formData.append('description', description);
    
    formData.append('category', documentData.category);
    
    // Append file
    formData.append('file', file);
    
    try {
        const response = await api.post('/tax-documents', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error: any) { // Explicitly type the error as any
        console.error('Upload error details:', error?.response?.data);
        throw error;
    }
  },

  deleteTaxDocument: async (id: string): Promise<void> => {
    await api.delete(`/tax-documents/${id}`);
  },

  getDownloadUrl: (id: string): string => {
    return `${api.defaults.baseURL}/tax-documents/download/${id}`;
  }
};

export default taxDocumentService;