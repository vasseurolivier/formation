'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, AlertTriangle } from 'lucide-react';
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
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const currentLogoUrl = logoData?.url;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    setUploadError(null);
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
        console.error("[UPLOAD_ERROR]", error);
        
        let detailedMessage = "Une erreur inconnue est survenue.";
        if (error instanceof Error) {
             detailedMessage = error.message;
             if ('code' in error) {
                detailedMessage = `Code: ${(error as any).code}\nMessage: ${error.message}`;
             }
        } else if (typeof error === 'object' && error !== null) {
            try {
                detailedMessage = JSON.stringify(error, null, 2);
            } catch (e) {
                detailedMessage = "Impossible de convertir l'objet d'erreur en chaîne de caractères.";
            }
        } else {
            detailedMessage = String(error);
        }

        setUploadError(detailedMessage);
        
        toast({
            variant: "destructive",
            title: "Échec du téléversement",
            description: "Une erreur est survenue. Voir les détails ci-dessous.",
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

            {uploadError && (
              <div className="mt-4 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 mt-0.5"/>
                  <div>
                    <p className="font-semibold">Une erreur est survenue</p>
                    <pre className="text-xs whitespace-pre-wrap font-mono mt-1">{uploadError}</pre>
                  </div>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
