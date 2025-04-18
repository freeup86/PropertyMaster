import { useState, useCallback, useEffect, useRef } from 'react';
import unitImageService from '../services/unitImageService';

export const useUnitImages = (propertyId?: string, unitId?: string) => {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Use useRef to store previous values for comparison
    const prevPropertyIdRef = useRef<string | undefined>(propertyId);
    const prevUnitIdRef = useRef<string | undefined>(unitId);

    const fetchUnitImages = useCallback(async () => {
        console.log('fetchUnitImages called', { propertyId, unitId });
        if (!propertyId || !unitId) {
            setImages([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await unitImageService.getUnitImages(propertyId, unitId);
            const imageUrls = response.map(img =>
                `data:${img.contentType};base64,${img.base64ImageData}`
            );
            setImages(imageUrls);
            console.log('fetchUnitImages completed', imageUrls);
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Failed to fetch unit images';
            setError(errorMessage);
            setImages([]);
        } finally {
            setLoading(false);
        }
    }, [propertyId, unitId]); // Dependencies for useCallback

    useEffect(() => {
        console.log('useEffect triggered', { propertyId, unitId });

        // Only fetch if propertyId or unitId have changed
        if (prevPropertyIdRef.current !== propertyId || prevUnitIdRef.current !== unitId) {
            fetchUnitImages();
        }

        // Update refs for next comparison
        prevPropertyIdRef.current = propertyId;
        prevUnitIdRef.current = unitId;

    }, [propertyId, unitId, fetchUnitImages]); // Dependencies for useEffect

    const uploadImages = useCallback(async (files: File[]) => {
        if (!propertyId || !unitId) {
            setError('Property ID and Unit ID are required');
            return [];
        }

        try {
            setLoading(true);
            setError(null);

            // Use the non-null assertion operator (!) to tell the compiler 
            // that propertyId and unitId are not undefined.
            const response = await unitImageService.uploadUnitImages(propertyId!, unitId!, files);

            const newImageUrls = response.map(img =>
                `data:${img.contentType};base64,${img.base64ImageData}`
            );

            // Add new images to existing images
            setImages(currentImages => [...currentImages, ...newImageUrls]);

            console.log('uploadImages completed', newImageUrls);

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
    }, [propertyId, unitId]); // Dependencies for useCallback

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

            console.log('deleteImage completed', imageUrl);

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
    }, [propertyId, unitId]); // Dependencies for useCallback

    return {
        images,
        loading,
        error,
        fetchUnitImages,
        uploadImages,
        deleteImage
    };
};