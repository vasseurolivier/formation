'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Film, Upload, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { useFirestore, useDoc, useMemoFirebase, useAuth, useFirebaseApp } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { MediaAsset } from '@/lib/firebase-types';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

type CustomMedia = {
  url: string;
  type: string;
};

const ManagedHeroMediaCard = ({ image }: { image: ImagePlaceholder }) => {
  const { toast } = useToast();
  const firestore = useFirestore();
  const auth = useAuth();
  const firebaseApp = useFirebaseApp();

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
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'Aucun fichier sélectionné',
        description: "Veuillez sélectionner un fichier média à téléverser.",
      });
      return;
    }
    if (!mediaDocRef || !auth || !firebaseApp) {
        toast({
            variant: "destructive",
            title: "Erreur d'initialisation",
            description: "Les services Firebase ne sont pas disponibles. Veuillez rafraîchir la page.",
        });
        return;
    }

    setIsUploading(true);

    try {
      const storage = getStorage(firebaseApp);
      const filePath = `mediaAssets/${image.id}/${selectedFile.name}`;
      const fileRef = storageRef(storage, filePath);
      
      const snapshot = await uploadBytes(fileRef, selectedFile);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      
      const newMediaData: Omit<MediaAsset, 'id'> = {
        url: downloadUrl,
        type: selectedFile.type.startsWith('video') ? 'video' : 'image',
        fileName: selectedFile.name,
        altTextFr: image.description,
        altTextEn: image.description,
        altTextZh: image.description,
        mimeType: selectedFile.type,
        uploadedAt: new Date().toISOString()
      };

      await setDoc(mediaDocRef, newMediaData, { merge: true });
      
      toast({
        title: 'Téléversement réussi !',
        description: `Le média pour "${image.description}" a été mis à jour.`,
      });
      
      setPreview(null);
      setSelectedFile(null);

    } catch (error: any) {
      console.error("Upload failed:", error);
      let description = "Une erreur inattendue est survenue.";
      switch (error.code) {
        case 'storage/unauthorized':
          description = "Permission refusée. Assurez-vous d'être un administrateur connecté.";
          break;
        case 'storage/canceled':
          description = "Le téléversement a été annulé.";
          break;
      }
      toast({ variant: "destructive", title: "Échec du téléversement", description });
    } finally {
      setIsUploading(false);
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
              Personnalisé
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
          {isUploading ? (
            <Button disabled className="w-full">
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </Button>
          ) : (
            <Button
              onClick={handleUpload}
              disabled={!selectedFile}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" /> Sauvegarder le Média
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
             Téléversez des images ou des vidéos personnalisées pour les sections héro principales de votre site. Vos modifications seront sauvegardées de manière permanente et visibles par tous les utilisateurs.
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
