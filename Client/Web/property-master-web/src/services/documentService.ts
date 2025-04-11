import api from './api';

export interface Document {
    id: string;
    propertyId: string;
    propertyName: string;
    unitId?: string;
    unitNumber?: string;
    tenantId?: string;
    tenantName?: string;
    fileName: string;
    contentType: string;
    fileSize: number;
    documentType: string;
    description: string;
    expirationDate?: string; //  <-  string | undefined
    uploadDate: string;
}

export interface CreateDocumentRequest {
    propertyId: string;
    unitId?: string;
    tenantId?: string;
    documentType: string;
    description: string;
    expirationDate?: string; //  <-  string | undefined
}

export interface UpdateDocumentRequest {
    documentType?: string;
    description?: string;
    expirationDate?: string; //  <-  string | undefined
}

const documentService = {
  getDocumentsByProperty: async (propertyId: string): Promise<Document[]> => {
    const response = await api.get(`/documents/property/${propertyId}`);
    return response.data;
  },

  getDocumentsByUnit: async (unitId: string): Promise<Document[]> => {
    const response = await api.get(`/documents/unit/${unitId}`);
    return response.data;
  },

  getDocumentsByTenant: async (tenantId: string): Promise<Document[]> => {
    const response = await api.get(`/documents/tenant/${tenantId}`);
    return response.data;
  },

  getDocument: async (id: string): Promise<Document> => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  uploadDocument: async (documentData: CreateDocumentRequest, file: File): Promise<Document> => {
    const formData = new FormData();
    
    // Append document data
    formData.append('propertyId', documentData.propertyId);
    if (documentData.unitId) formData.append('unitId', documentData.unitId);
    if (documentData.tenantId) formData.append('tenantId', documentData.tenantId);
    if (documentData.documentType) formData.append('documentType', documentData.documentType);
    if (documentData.description) formData.append('description', documentData.description);
    if (documentData.expirationDate) formData.append('expirationDate', documentData.expirationDate);
    
    // Append file
    formData.append('file', file);
    
    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },

  updateDocument: async (id: string, documentData: UpdateDocumentRequest): Promise<Document> => {
    const response = await api.put(`/documents/${id}`, documentData);
    return response.data;
  },

  deleteDocument: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },

  getDownloadUrl: (id: string): string => {
    return `${api.defaults.baseURL}/documents/download/${id}`;
  }
};

export default documentService;