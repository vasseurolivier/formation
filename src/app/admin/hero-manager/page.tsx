'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Film, Upload, CheckCircle, Video, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { MediaAsset } from '@/lib/firebase-types';

type CustomMedia = {
  url: string;
  type: string;
};

const ManagedHeroMediaCard = ({ image }: { image: ImagePlaceholder }) => {
  const { toast } = useToast();
  const firestore = useFirestore();

  const mediaDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'mediaAssets', image.id);
  }, [firestore, image.id]);

  const { data: customMediaData, isLoading } = useDoc<MediaAsset>(mediaDocRef);

  const [preview, setPreview] = useState<CustomMedia | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview({ url: reader.result as string, type: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (preview && selectedFile && mediaDocRef) {
      setIsUploading(true);
      const newMediaData: Omit<MediaAsset, 'id' | 'uploadedAt'> = {
        url: preview.url,
        type: preview.type.startsWith('video') ? 'video' : 'image',
        fileName: selectedFile.name,
        altTextFr: image.description,
        altTextEn: image.description,
        altTextZh: image.description,
        mimeType: selectedFile.type,
      };

      try {
        await setDocumentNonBlocking(mediaDocRef, { ...newMediaData, uploadedAt: new Date().toISOString() }, { merge: true });
        toast({
          title: 'Media successfully uploaded!',
          description: `The hero media for "${image.description}" has been updated.`,
        });
        setPreview(null);
        setSelectedFile(null);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Upload failed', description: 'Could not save media to the database.' });
        console.error(error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const media: CustomMedia = preview 
    || (customMediaData ? { url: customMediaData.url, type: customMediaData.type } : { url: image.imageUrl, type: 'image' });
  
  const isCustom = !!customMediaData && !preview;
  const isVideo = media.type.startsWith('video');

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-base font-medium">{image.description}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <div className="relative aspect-video w-full rounded-md overflow-hidden border bg-black">
          {isLoading ? (
             <div className="w-full h-full bg-muted animate-pulse" />
          ) : isVideo ? (
              <video key={media.url} src={media.url} controls className="w-full h-full object-cover" />
          ) : (
              <Image src={media.url} alt={image.description} fill className="object-cover" />
          )}
          {isCustom && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Custom
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Input
            id={`file-${image.id}`}
            type="file"
            accept="image/*,video/mp4,video/webm"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : <><Upload className="mr-2 h-4 w-4" /> Save Media</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


export default function HeroManagerPage() {
  const heroImages = PlaceHolderImages.filter(img => img.id.startsWith('hero-'));

  return (
    <div className="min-h-screen bg-background p-4 pt-24 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
              <Film />
              Hero Section Media Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
             Upload custom images or videos for the main hero sections of your site. Your changes will be saved permanently and will be visible to all users.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {heroImages.map(image => (
                <ManagedHeroMediaCard key={image.id} image={image} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
