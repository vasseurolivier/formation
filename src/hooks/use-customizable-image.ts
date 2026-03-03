'use client';
import { useState, useEffect, useCallback } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const STORAGE_KEY = 'customImages';

export function useCustomizableImage(imageId: string) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const updateImage = useCallback(() => {
        const originalImage = PlaceHolderImages.find(img => img.id === imageId);
        try {
            const storedImages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            const customUrl = storedImages[imageId];
            
            if (customUrl) {
                setImageUrl(customUrl);
            } else if (originalImage) {
                setImageUrl(originalImage.imageUrl);
            } else {
                setImageUrl(null);
            }
        } catch (e) {
             if (originalImage) {
                setImageUrl(originalImage.imageUrl);
            }
        }
    }, [imageId]);

    useEffect(() => {
        updateImage();

        window.addEventListener('storage', updateImage);
        return () => {
            window.removeEventListener('storage', updateImage);
        };
    }, [updateImage]);

    return imageUrl;
}
