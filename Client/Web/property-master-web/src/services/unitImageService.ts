import axios from 'axios';
import api from './api';

export interface UnitImageDto {
  id: string;
  unitId: string;
  fileName: string;
  contentType: string;
  base64ImageData: string;
}

export type UnitImageUploadResponse = UnitImageDto[];

const BASE_URL = 'http://localhost:5044/api';

const unitImageService = {
  uploadUnitImages: async (propertyId: string, unitId: string, images: File[]): Promise<UnitImageUploadResponse> => {
    const formData = new FormData();
    
    // Send one image at a time for simplicity
    const image = images[0];
    formData.append('image', image, image.name);

    try {
      const response = await api.post<UnitImageUploadResponse>(`/properties/${propertyId}/units/${unitId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 300000
      });

      return response.data;
    } catch (error: any) {
      console.error('Image upload error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  getUnitImages: async (propertyId: string, unitId: string): Promise<UnitImageUploadResponse> => {
    try {
      const response = await api.get<UnitImageUploadResponse>(`/properties/${propertyId}/units/${unitId}/images`);
      return response.data;
    } catch (error: any) {
      console.error('Get images error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  deleteUnitImage: async (propertyId: string, unitId: string, imageData: string): Promise<void> => {
    try {
      // Extract content type and base64 data
      const [header, base64Data] = imageData.split(',');
      const contentType = header.split(':')[1].split(';')[0];

      // Full debugging object
      const debugObject = {
        propertyId,
        unitId,
        contentType,
        base64DataLength: base64Data.length,
        fullImageDataLength: imageData.length,
        timestamp: new Date().toISOString()
      };

      console.group('🔍 Delete Unit Image - Comprehensive Debug');
      console.log('Debug Object:', JSON.stringify(debugObject, null, 2));

      // Prepare the delete request with maximum information
      const deleteRequestBody = {
        contentType: contentType,
        base64Image: base64Data,
        propertyId: propertyId,
        unitId: unitId,
        debugInfo: debugObject
      };

      console.log('Delete Request Body:', JSON.stringify(deleteRequestBody, null, 2));

      // Multiple potential routes to try
      const routeVariations = [
        `/properties/${propertyId}/units/image/${unitId}/images`,
        `/properties/${propertyId}/units/${unitId}/images`,
        `/properties/${propertyId}/image/${unitId}/images`
      ];

      let lastError = null;
      for (const route of routeVariations) {
        try {
          console.log(`🔬 Attempting Route: ${route}`);

          const response = await api.delete(route, {
            data: deleteRequestBody,
            headers: {
              'Content-Type': 'application/json',
              'X-Debug-Route': route
            }
          });

          console.log('✅ Delete Image Response:', response);
          console.groupEnd();

          return response.data;
        } catch (routeError: any) {
          console.warn(`❌ Route Failed: ${route}`, {
            errorMessage: routeError.message,
            errorResponse: routeError.response?.data,
            errorStatus: routeError.response?.status
          });
          lastError = routeError;
        }
      }

      // Log final error details
      console.error('🚨 Final Delete Image Error:', lastError);
      console.groupEnd();

      // Throw the last encountered error
      throw lastError || new Error('No valid routes found for image deletion');
    } catch (error: any) {
      console.error('🚨 Unhandled Delete Image Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        errorObject: error
      });
      throw error;
    }
  }
};

export default unitImageService;