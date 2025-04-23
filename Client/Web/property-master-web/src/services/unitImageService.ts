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
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const formData = new FormData();
        formData.append('image', image, image.name);
  
        try {
          const response = await api.post<UnitImageDto>(`/properties/${propertyId}/units/${unitId}/images`, formData, {
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
      })
    );
  
    return uploadedImages;
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

      console.log('Attempting to delete image:', {
        propertyId,
        unitId,
        imageDataLength: base64Data.length
      });

      const response = await api.delete(`/properties/${propertyId}/units/${unitId}/images`, {
        data: {
          contentType,
          base64Image: base64Data
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete image response:', response);
    } catch (error: any) {
      console.error('Delete image error details:', {
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