'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { MediaAsset } from '@/lib/firebase-types';
import { Label } from '@/components/ui/label';

const LOGO_DOC_ID = 'siteLogo';

export default function LogoUploaderPage() {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const { toast } = useToast();
  const firestore = useFirestore();

  const logoDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'mediaAssets', LOGO_DOC_ID);
  }, [firestore]);

  const { data: logoData, isLoading } = useDoc<MediaAsset>(logoDocRef);
  const [isSaving, setIsSaving] = useState(false);
  
  const currentLogoUrl = logoData?.url;

  const handleSave = () => {
    if (!logoUrl) {
      toast({
        variant: 'destructive',
        title: 'URL manquante',
        description: 'Veuillez saisir une URL pour le logo.',
      });
      return;
    }
    if (!logoDocRef) {
      toast({
        variant: "destructive",
        title: "Erreur d'initialisation",
        description: "Les services Firebase ne sont pas disponibles.",
      });
      return;
    }

    setIsSaving(true);

    const newLogoData: Omit<MediaAsset, 'id'> = {
      url: logoUrl,
      type: 'image',
      fileName: 'logo_from_url.png',
      altTextFr: "Logo du site",
      altTextEn: "Site logo",
      altTextZh: "网站标志",
      mimeType: 'image/png',
      uploadedAt: new Date().toISOString()
    };

    setDoc(logoDocRef, newLogoData, { merge: true })
      .then(() => {
        toast({
          title: 'Logo sauvegardé avec succès !',
          description: 'Le nouveau logo va maintenant être affiché dans l\'en-tête.',
        });
        setLogoUrl('');
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

  const displayUrl = logoUrl || currentLogoUrl;

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
              Gérer le Logo du Site Web
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-semibold">Logo Actuel</h3>
                {isLoading ? (
                    <div className="w-full h-14 bg-muted rounded-md animate-pulse"></div>
                ) : currentLogoUrl ? (
                    <div className="flex justify-start border p-2 rounded-md">
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
                    <p className="text-sm text-muted-foreground">Aucun logo défini pour le moment.</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="logo-url">Nouvelle URL du logo</Label>
                <p className="text-sm text-muted-foreground">Collez l'URL de la nouvelle image pour le logo. Taille recommandée : environ 530x110 pixels.</p>
                <Input
                  id="logo-url"
                  type="text"
                  placeholder="https://example.com/nouveau-logo.png"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  disabled={isSaving}
                />
            </div>
            
            {isSaving ? (
              <Button disabled className="w-full">
                <Save className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={!logoUrl} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder le nouveau logo
              </Button>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
