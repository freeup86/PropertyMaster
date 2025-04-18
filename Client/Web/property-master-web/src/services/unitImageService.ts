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
  },
  deleteUnitImage: async (propertyId: string, unitId: string, imageUrl: string): Promise<void> => {
    try {
      console.log('Deleting image:', imageUrl);
      // Extract just the filename if needed from the data URL
      let params: any = { imageUrl };
      
      // If imageUrl is a data URL, we might need to extract just the relevant part for the API
      if (imageUrl.startsWith('data:')) {
        console.log('Image URL is a data URL, may need processing');
        // Your backend might expect just the image ID or a different format
        // You might need custom logic here depending on your API
      }
      
      console.log('Delete params:', params);
      
      const response = await api.delete(`/properties/${propertyId}/units/${unitId}/images`, {
        params: params
      });
      
      console.log('Delete response:', response);
    } catch (error: any) {
      console.error('Delete image error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }  
};

export default unitImageService;