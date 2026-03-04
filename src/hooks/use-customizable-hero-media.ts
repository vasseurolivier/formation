'use client';
import { useState, useEffect, useCallback } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const STORAGE_KEY = 'customHeroMedia';

export type HeroMedia = {
  url: string;
  type: string;
};

export function useCustomizableHeroMedia(imageId: string) {
    const [media, setMedia] = useState<HeroMedia | null>(null);

    const updateMedia = useCallback(() => {
        const originalImage = PlaceHolderImages.find(img => img.id === imageId);
        try {
            const storedMedia = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            const custom = storedMedia[imageId];
            
            if (custom && custom.url && custom.type) {
                setMedia(custom);
            } else if (originalImage) {
                setMedia({ url: originalImage.imageUrl, type: 'image' });
            } else {
                setMedia(null);
            }
        } catch (e) {
             if (originalImage) {
                setMedia({ url: originalImage.imageUrl, type: 'image' });
            }
        }
    }, [imageId]);

    useEffect(() => {
        updateMedia();

        const handleStorageChange = (event: StorageEvent) => {
          if (event.key === STORAGE_KEY) {
            updateMedia();
          }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [updateMedia]);

    return media;
}
