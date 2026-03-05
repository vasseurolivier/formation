'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ImageUp, Save, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { campusLocations, courses } from '@/lib/data';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { MediaAsset } from '@/lib/firebase-types';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/use-translation';

type ImageGroup = {
  title: string;
  images: ImagePlaceholder[];
};

const ManagedImageCard = ({ image }: { image: ImagePlaceholder }) => {
  const { toast } = useToast();
  const firestore = useFirestore();

  const imageDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'mediaAssets', image.id);
  }, [firestore, image.id]);

  const { data: customImageData, isLoading } = useDoc<MediaAsset>(imageDocRef);

  const [imageUrl, setImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!imageUrl) {
      toast({
        variant: 'destructive',
        title: 'URL manquante',
        description: "Veuillez saisir une URL pour l'image.",
      });
      return;
    }
    if (!imageDocRef) {
      toast({
        variant: "destructive",
        title: "Erreur d'initialisation",
        description: "Les services Firebase ne sont pas disponibles.",
      });
      return;
    }
    
    setIsSaving(true);

    const newMediaData: Omit<MediaAsset, 'id'> = {
      url: imageUrl,
      type: 'image',
      fileName: 'image_from_url.jpg',
      altTextFr: image.description,
      altTextEn: image.description,
      altTextZh: image.description,
      mimeType: 'image/jpeg',
      uploadedAt: new Date().toISOString(),
    };

    setDoc(imageDocRef, newMediaData, { merge: true })
      .then(() => {
        toast({
          title: 'Image sauvegardée !',
          description: `L'image pour "${image.description}" a été mise à jour.`,
        });
        setImageUrl('');
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

  const displayUrl = customImageData?.url || image.imageUrl;
  const isCustom = !!customImageData;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-base font-medium">{image.description}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <div className="relative aspect-video w-full rounded-md overflow-hidden border">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <Image
              src={displayUrl}
              alt={image.description}
              fill
              className="object-cover"
              unoptimized
            />
          )}
          {isCustom && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Personnalisé
            </div>
          )}
        </div>
        <div className="space-y-2">
            <Label htmlFor={`url-${image.id}`}>Nouvelle URL d'image</Label>
            <Input
                id={`url-${image.id}`}
                type="text"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={isSaving}
            />
            {isSaving ? (
              <Button disabled className="w-full">
                <Save className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </Button>
            ) : (
              <Button
                  onClick={handleSave}
                  disabled={!imageUrl}
                  className="w-full"
              >
                <Save className="mr-2 h-4 w-4" /> Sauvegarder l'image
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ImageManagerPage() {
  const { t } = useTranslation();

  const otherImageGroups: ImageGroup[] = [
    {
      title: 'Images de cours (Miniatures)',
      images: PlaceHolderImages.filter(img => img.id.startsWith('course-')),
    },
    {
      title: 'Images des pages générales',
      images: PlaceHolderImages.filter(img => img.id.startsWith('about-')),
    },
  ];

  const campusImageGroups: ImageGroup[] = campusLocations.map(campus => {
      const mainImage = PlaceHolderImages.find(img => img.id === campus.mainImageId);
      const galleryImages = campus.galleryImageIds.map(id => PlaceHolderImages.find(img => img.id === id));
      return {
          title: `Campus: ${campus.name}`,
          images: [mainImage, ...galleryImages].filter((img): img is ImagePlaceholder => !!img)
      }
  });

  const courseGalleryImageGroups: ImageGroup[] = courses.map(course => {
    const galleryImages = course.galleryImageIds.map(id => PlaceHolderImages.find(img => img.id === id));
    return {
        title: `Galerie: ${t(course.titleKey)}`,
        images: galleryImages.filter((img): img is ImagePlaceholder => !!img)
    }
  });

  const imageGroups: ImageGroup[] = [...otherImageGroups, ...campusImageGroups, ...courseGalleryImageGroups]
    .filter(group => group.images.length > 0)
    .sort((a,b) => a.title.localeCompare(b.title));

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
              <ImageUp />
              Gestionnaire d'Images du Site Web
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Collez une URL pour remplacer n'importe quelle image du site. Les modifications sont sauvegardées de manière permanente et seront visibles par tous les utilisateurs.
            </p>
            <Accordion type="multiple" defaultValue={['item-0']} className="w-full space-y-4">
              {imageGroups.map((group, groupIndex) => (
                <AccordionItem value={`item-${groupIndex}`} key={group.title}>
                  <AccordionTrigger className="text-lg font-semibold bg-muted px-4 rounded-md hover:no-underline">
                    {group.title} ({group.images.length} images)
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {group.images.map(image => (
                        <ManagedImageCard key={image.id} image={image} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
