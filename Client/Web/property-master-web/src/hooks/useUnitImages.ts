import { useState } from 'react';
import unitImageService from '../services/unitImageService';

export const useUnitImages = (propertyId: string, unitId: string) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnitImages = async () => {
    try {
      setLoading(true);
      const response = await unitImageService.getUnitImages(propertyId, unitId);
      setImages(response.imageUrls);
      setError(null);
    } catch (err) {
      setError('Failed to fetch unit images');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (files: File[]) => {
    try {
      setLoading(true);
      const response = await unitImageService.uploadUnitImages(propertyId, unitId, files);
      setImages(response.imageUrls);
      setError(null);
      return response.imageUrls;
    } catch (err) {
      setError('Failed to upload images');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageUrl: string) => {
    try {
      setLoading(true);
      await unitImageService.deleteUnitImage(propertyId, unitId, imageUrl);
      setImages(images.filter(url => url !== imageUrl));
      setError(null);
    } catch (err) {
      setError('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  return {
    images,
    loading,
    error,
    fetchUnitImages,
    uploadImages,
    deleteImage
  };
};