'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase, useAuth, useFirebaseApp } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { MediaAsset } from '@/lib/firebase-types';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const LOGO_DOC_ID = 'siteLogo';

export default function LogoUploaderPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();
  const auth = useAuth();
  const firebaseApp = useFirebaseApp();

  const logoDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'mediaAssets', LOGO_DOC_ID);
  }, [firestore]);

  const { data: logoData, isLoading } = useDoc<MediaAsset>(logoDocRef);
  const [isUploading, setIsUploading] = useState(false);
  
  const currentLogoUrl = logoData?.url;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'Aucun fichier sélectionné',
        description: 'Veuillez sélectionner un fichier image à téléverser.',
      });
      return;
    }
    if (!logoDocRef || !auth || !firebaseApp) {
        toast({
            variant: "destructive",
            title: "Erreur d'initialisation",
            description: "Les services Firebase ne sont pas disponibles. Veuillez rafraîchir la page.",
        });
        return;
    }

    setIsUploading(true);
    
    const storage = getStorage(firebaseApp);
    const filePath = `mediaAssets/${LOGO_DOC_ID}/${selectedFile.name}`;
    const fileRef = storageRef(storage, filePath);

    try {
      // Step 1: Upload the file to Firebase Storage
      await uploadBytes(fileRef, selectedFile);
      
      // Step 2: Get the download URL
      const downloadUrl = await getDownloadURL(fileRef);

      // Step 3: Create the metadata object for Firestore
      const newLogoData: Omit<MediaAsset, 'id'> = {
        url: downloadUrl,
        type: 'image',
        fileName: selectedFile.name,
        altTextFr: "Logo du site",
        altTextEn: "Site logo",
        altTextZh: "网站标志",
        mimeType: selectedFile.type,
        uploadedAt: new Date().toISOString()
      };
      
      // Step 4: Save the metadata to Firestore
      await setDoc(logoDocRef, newLogoData, { merge: true });

      toast({
        title: 'Logo téléversé avec succès !',
        description: 'Le nouveau logo va maintenant être affiché dans l\'en-tête.',
      });

      setLogoPreview(null);
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
        variant: 'destructive',
        title: 'Le téléversement a échoué',
        description: description,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const displayUrl = logoPreview || currentLogoUrl;

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
            <CardTitle className="font-headline text-2xl text-primary">
              Upload Website Logo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-semibold">Current Logo</h3>
                {isLoading ? (
                    <div className="w-full h-14 bg-muted rounded-md animate-pulse"></div>
                ) : currentLogoUrl ? (
                    <div className="flex justify-start">
                        <div className="relative" style={{ height: '3.15rem', width: '6.6rem' }}>
                            <Image
                                src={currentLogoUrl}
                                alt="Current Site Logo"
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'left' }}
                            />
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No logo uploaded yet.</p>
                )}
            </div>

            <div className="space-y-2">
                <p className="text-muted-foreground">Select a new image file for the site logo. Recommended size: around 530x110 pixels.</p>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {logoPreview && (
              <div className="space-y-4">
                  <h3 className="font-semibold">New Logo Preview</h3>
                  <div className="flex justify-start border rounded-md p-2">
                        <div className="relative" style={{ height: '3.15rem', width: '6.6rem' }}>
                            <Image
                                src={logoPreview}
                                alt="Logo Preview"
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'left' }}
                            />
                        </div>
                  </div>
              </div>
            )}

            <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Téléversement..." : "Sauvegarder et appliquer le logo"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
