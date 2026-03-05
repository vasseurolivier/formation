'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase, useFirebaseApp } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { MediaAsset } from '@/lib/firebase-types';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const LOGO_DOC_ID = 'siteLogo';

export default function LogoUploaderPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();
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
    if (!logoDocRef || !firebaseApp) {
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
        const filePath = `mediaAssets/${LOGO_DOC_ID}/${selectedFile.name}`;
        const fileRef = storageRef(storage, filePath);

        const snapshot = await uploadBytes(fileRef, selectedFile);
        const downloadUrl = await getDownloadURL(snapshot.ref);

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
        
        await setDoc(logoDocRef, newLogoData, { merge: true });

        toast({
          title: 'Logo téléversé avec succès !',
          description: 'Le nouveau logo va maintenant être affiché dans l\'en-tête.',
        });
        setLogoPreview(null);
        setSelectedFile(null);
    } catch (error) {
        console.error("Échec du téléversement:", error);
        toast({
            variant: "destructive",
            title: "Échec du téléversement",
            description: "Une erreur est survenue. Veuillez vérifier la console pour plus de détails.",
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
                <Input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
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

            {isUploading ? (
              <Button disabled className="w-full">
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </Button>
            ) : (
              <Button onClick={handleUpload} disabled={!selectedFile} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Sauvegarder et appliquer le logo
              </Button>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
