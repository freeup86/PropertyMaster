import { useState, useCallback, useEffect } from 'react';
import unitImageService from '../services/unitImageService';

export const useUnitImages = (propertyId?: string, unitId?: string) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchUnitImages = useCallback(async () => {
    // Only proceed if both propertyId and unitId are provided
    if (!propertyId || !unitId) {
      setImages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch images using the service
      const response = await unitImageService.getUnitImages(propertyId, unitId);
      
      // Convert images to base64 URLs
      const imageUrls = response.map(img => 
        `data:${img.contentType};base64,${img.base64ImageData}`
      );
      
      setImages(imageUrls);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to fetch unit images';
      
      setError(errorMessage);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [propertyId, unitId]);

  // Use effect to fetch images when propertyId or unitId changes
  useEffect(() => {
    fetchUnitImages();
  }, [fetchUnitImages]);

  // Memoized upload function
  const uploadImages = useCallback(async (files: File[]) => {
    if (!propertyId || !unitId) {
      setError('Property ID and Unit ID are required');
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await unitImageService.uploadUnitImages(propertyId, unitId, files);
      
      const newImageUrls = response.map(img => 
        `data:${img.contentType};base64,${img.base64ImageData}`
      );
      
      // Add new images to existing images
      setImages(currentImages => [...currentImages, ...newImageUrls]);
      
      return newImageUrls;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to upload images';
      
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [propertyId, unitId]);

  // Memoized delete function
  const deleteImage = useCallback(async (imageUrl: string) => {
    if (!propertyId || !unitId) {
      setError('Property ID and Unit ID are required');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      await unitImageService.deleteUnitImage(propertyId, unitId, imageUrl);
      
      // Remove the deleted image from the state
      setImages(currentImages => 
        currentImages.filter(url => url !== imageUrl)
      );
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to delete image';
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [propertyId, unitId]);

  return {
    images,
    loading,
    error,
    fetchUnitImages,
    uploadImages,
    deleteImage
  };
};