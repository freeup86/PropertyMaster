import api from './api';

export interface UnitImageDto {
  id: string;
  unitId: string;
  fileName: string;
  contentType: string;
  base64ImageData: string;
}

export type UnitImageUploadResponse = UnitImageDto[];

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
  }
};

export default unitImageService;