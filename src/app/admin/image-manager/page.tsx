'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ImageUp, Upload, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { campusLocations } from '@/lib/data';
import { useFirestore, useDoc, useMemoFirebase, useAuth, useFirebaseApp } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { MediaAsset } from '@/lib/firebase-types';
import { Skeleton } from '@/components/ui/skeleton';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

type ImageGroup = {
  title: string;
  images: ImagePlaceholder[];
};

const ManagedImageCard = ({ image }: { image: ImagePlaceholder }) => {
  const { toast } = useToast();
  const firestore = useFirestore();
  const auth = useAuth();
  const firebaseApp = useFirebaseApp();

  const imageDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'mediaAssets', image.id);
  }, [firestore, image.id]);

  const { data: customImageData, isLoading } = useDoc<MediaAsset>(imageDocRef);

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'Aucun fichier sélectionné',
        description: "Veuillez sélectionner un fichier image à téléverser.",
      });
      return;
    }
    if (!imageDocRef || !auth || !firebaseApp) {
        toast({
            variant: "destructive",
            title: "Erreur d'initialisation",
            description: "Les services Firebase ne sont pas disponibles. Veuillez rafraîchir la page.",
        });
        return;
    }
    
    setIsUploading(true);

    const storage = getStorage(firebaseApp);
    const filePath = `mediaAssets/${image.id}/${selectedFile.name}`;
    const fileRef = storageRef(storage, filePath);

    try {
      // Step 1: Upload the file to Firebase Storage
      await uploadBytes(fileRef, selectedFile);

      // Step 2: Get the download URL
      const downloadUrl = await getDownloadURL(fileRef);

      // Step 3: Create metadata object for Firestore
      const newMediaData: Omit<MediaAsset, 'id'> = {
        url: downloadUrl,
        type: 'image',
        fileName: selectedFile.name,
        altTextFr: image.description,
        altTextEn: image.description,
        altTextZh: image.description,
        mimeType: selectedFile.type,
        uploadedAt: new Date().toISOString(),
      };

      // Step 4: Save metadata to Firestore
      await setDoc(imageDocRef, newMediaData, { merge: true });

      toast({
        title: 'Téléversement réussi !',
        description: `L'image pour "${image.description}" a été mise à jour.`,
      });

      setPreview(null);
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Upload failed:", error);
      let description = "Une erreur inattendue est survenue. Veuillez consulter la console pour les détails techniques.";
      if (error.code === 'storage/unauthorized') {
          description = "Permission refusée par le serveur. Assurez-vous d'être connecté et que vos permissions d'administrateur sont actives.";
      } else if (error.code) {
          description = `Erreur du serveur : ${error.code}. Veuillez consulter la console.`
      }
      
      toast({
        variant: "destructive",
        title: "Le téléversement a échoué",
        description: description,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const displayUrl = preview || customImageData?.url || image.imageUrl;
  const isCustom = !!customImageData && !preview;

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
            <Input
                id={`file-${image.id}`}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
            />
            <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full"
            >
              {isUploading ? 'Téléversement...' : <><Upload className="mr-2 h-4 w-4" /> Sauvegarder l'image</>}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ImageManagerPage() {
  const otherImageGroups: ImageGroup[] = [
    {
      title: 'Images de cours',
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

  const imageGroups: ImageGroup[] = [...otherImageGroups, ...campusImageGroups]
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
              Téléversez et gérez les images utilisées sur l'ensemble du site. Les modifications sont sauvegardées de manière permanente et seront visibles par tous les utilisateurs.
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
