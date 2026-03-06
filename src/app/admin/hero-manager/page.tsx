'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Film, Save, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { MediaAsset } from '@/lib/firebase-types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

type CustomMedia = {
  url: string;
  type: 'image' | 'video';
};

const ManagedHeroMediaCard = ({ image }: { image: ImagePlaceholder }) => {
  const { toast } = useToast();
  const { firestore, auth } = useFirebase();

  const mediaDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'mediaAssets', image.id);
  }, [firestore, image.id]);

  const { data: customMediaData, isLoading, error: docError, refetch } = useDoc<MediaAsset>(mediaDocRef);

  const [url, setUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSave = () => {
    setError(null);
    if (!url) {
      toast({
        variant: 'destructive',
        title: 'URL manquante',
        description: "Veuillez saisir une URL pour le média.",
      });
      return;
    }
    if (!mediaDocRef || !auth) {
      const initError = new Error("Les services Firebase ne sont pas disponibles.");
      setError(initError);
      return;
    }

    setIsSaving(true);
    
    const newMediaData: Omit<MediaAsset, 'id'> = {
      url: url,
      type: mediaType,
      fileName: 'media_from_url',
      altTextFr: image.description,
      altTextEn: image.description,
      altTextZh: image.description,
      mimeType: mediaType === 'image' ? 'image/png' : 'video/mp4',
      uploadedAt: new Date().toISOString()
    };

    setDoc(mediaDocRef, newMediaData, { merge: true })
      .then(() => {
        toast({
          title: 'Média sauvegardé !',
          description: `Le média pour "${image.description}" a été mis à jour.`,
        });
        setUrl('');
      })
      .catch((e) => {
        console.error("Échec de la sauvegarde :", e);
        setError(e);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };
  
  const effectiveError = error || docError;
  const originalImage = PlaceHolderImages.find(img => img.id === image.id);

  const media: CustomMedia | null = (() => {
    if (isLoading) return null;
    if (customMediaData) {
      return { url: customMediaData.url, type: customMediaData.type };
    }
    if (originalImage) {
      return { url: originalImage.imageUrl, type: 'image' };
    }
    return null;
  })();
  
  const isCustom = !!customMediaData;
  const isVideo = media?.type.startsWith('video');

  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-4">
        <CardTitle className="text-base font-medium">{image.description}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4 flex flex-col flex-grow">
        <div className="relative aspect-video w-full rounded-md overflow-hidden border bg-black">
          {!media ? (
             <Skeleton className="w-full h-full" />
          ) : isVideo ? (
              <video key={media.url} src={media.url} controls className="w-full h-full object-cover" />
          ) : (
              <Image src={media.url} alt={image.description} fill className="object-cover" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
          )}
          {isCustom && !isLoading && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Personnalisé
            </div>
          )}
        </div>
        <div className="space-y-3 mt-auto">
           {effectiveError && (
             <Alert variant="destructive">
               <AlertTriangle className="h-4 w-4" />
               <AlertDescription className="text-xs">
                 <strong>Erreur : {effectiveError.name}</strong><br />
                 {effectiveError.message}
                 <Button variant="ghost" size="sm" onClick={() => refetch()} className="ml-2">
                   <RefreshCw className="w-3 h-3 mr-1" />
                   Réessayer
                 </Button>
               </AlertDescription>
             </Alert>
           )}
          <div className="space-y-1">
            <Label htmlFor={`url-${image.id}`}>URL du Média</Label>
            <Input
              id={`url-${image.id}`}
              type="text"
              placeholder="https://example.com/media.mp4"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor={`type-${image.id}`}>Type de Média</Label>
            <Select
              value={mediaType}
              onValueChange={(value: 'image' | 'video') => setMediaType(value)}
              disabled={isSaving}
            >
              <SelectTrigger id={`type-${image.id}`}>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Vidéo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
              onClick={handleSave}
              disabled={isSaving || !url}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Sauvegarder le Média
                </>
              )}
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
          Retour au Tableau de Bord Admin
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
              <Film />
              Gestionnaire des Médias de la Section Héro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
             Collez une URL pour remplacer une image ou une vidéo pour les sections héro principales de votre site. Vos modifications seront sauvegardées de manière permanente.
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
