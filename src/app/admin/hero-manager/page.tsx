'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Film, Save, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { MediaAsset } from '@/lib/firebase-types';

type CustomMedia = {
  url: string;
  type: 'image' | 'video';
};

const ManagedHeroMediaCard = ({ image }: { image: ImagePlaceholder }) => {
  const { toast } = useToast();
  const firestore = useFirestore();

  const mediaDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'mediaAssets', image.id);
  }, [firestore, image.id]);

  const { data: customMediaData, isLoading } = useDoc<MediaAsset>(mediaDocRef);

  const [url, setUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!url) {
      toast({
        variant: 'destructive',
        title: 'URL manquante',
        description: "Veuillez saisir une URL pour le média.",
      });
      return;
    }
    if (!mediaDocRef) {
      toast({
        variant: "destructive",
        title: "Erreur d'initialisation",
        description: "Les services Firebase ne sont pas disponibles.",
      });
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
      .catch((error) => {
        console.error("Échec de la sauvegarde :", error);
        toast({
          variant: "destructive",
          title: "Échec de la sauvegarde",
          description: `Erreur : ${error.code} - ${error.message}`,
        });
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const media: CustomMedia = customMediaData 
    ? { url: customMediaData.url, type: customMediaData.type } 
    : { url: image.imageUrl, type: 'image' };
  
  const isCustom = !!customMediaData;
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
              Personnalisé
            </div>
          )}
        </div>
        <div className="space-y-3">
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
          {isSaving ? (
            <Button disabled className="w-full">
              <Save className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!url}
              className="w-full"
            >
              <Save className="mr-2 h-4 w-4" /> Sauvegarder le Média
            </Button>
          )}
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
