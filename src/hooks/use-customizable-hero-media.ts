'use client';

import { useState, useEffect } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { MediaAsset } from '@/lib/firebase-types';

export type HeroMedia = {
  url: string;
  type: string;
};

export function useCustomizableHeroMedia(imageId: string) {
    const firestore = useFirestore();

    const mediaDocRef = useMemoFirebase(() => {
        if (!firestore || !imageId) return null;
        return doc(firestore, 'mediaAssets', imageId);
    }, [firestore, imageId]);

    const { data: mediaData, isLoading } = useDoc<MediaAsset>(mediaDocRef);
    const [media, setMedia] = useState<HeroMedia | null>(null);

    useEffect(() => {
        const originalImage = PlaceHolderImages.find(img => img.id === imageId);

        if (isLoading) {
            // While loading, we can show the placeholder to avoid flashes of content
            if(originalImage) {
                setMedia({ url: originalImage.imageUrl, type: 'image' });
            }
            return;
        }

        if (mediaData?.url && mediaData.type) {
            setMedia({ url: mediaData.url, type: mediaData.type });
        } else if (originalImage) {
            setMedia({ url: originalImage.imageUrl, type: 'image' });
        } else {
            setMedia(null);
        }
    }, [mediaData, imageId, isLoading]);


    return media;
}
