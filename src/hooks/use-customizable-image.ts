'use client';
import { useState, useEffect } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { MediaAsset } from '@/lib/firebase-types';

export function useCustomizableImage(imageId: string) {
    const firestore = useFirestore();

    const imageDocRef = useMemoFirebase(() => {
        if (!firestore || !imageId) return null;
        return doc(firestore, 'mediaAssets', imageId);
    }, [firestore, imageId]);
    
    const { data: imageData, isLoading } = useDoc<MediaAsset>(imageDocRef);

    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isLoading) {
            // While loading, don't set any URL. Let the UI show a placeholder/skeleton.
            setImageUrl(null);
            return;
        }

        const originalImage = PlaceHolderImages.find(img => img.id === imageId);

        if (imageData?.url) {
            setImageUrl(imageData.url);
        } else if (originalImage) {
            setImageUrl(originalImage.imageUrl);
        } else {
            setImageUrl(null);
        }
    }, [imageData, imageId, isLoading]);

    return imageUrl;
}
