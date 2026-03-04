'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { MediaAsset } from '@/lib/firebase-types';

const LOGO_DOC_ID = 'siteLogo';

export default function LogoUploaderPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

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
    if (logoPreview && selectedFile && logoDocRef) {
      setIsUploading(true);
      
      // In a real app, you would upload the file to Firebase Storage
      // and then save the URL to Firestore.
      // For this prototype, we'll store the Data URL directly.
      const newLogoData: Omit<MediaAsset, 'id' | 'uploadedAt'> = {
        url: logoPreview,
        type: selectedFile.type,
        fileName: selectedFile.name,
        altTextFr: "Logo du site",
        altTextEn: "Site logo",
        altTextZh: "网站标志",
        mimeType: selectedFile.type,
      };

      setDocumentNonBlocking(logoDocRef, {
        ...newLogoData,
        uploadedAt: new Date().toISOString()
      }, { merge: true });

      toast({
        title: 'Logo successfully uploaded!',
        description: 'The new logo will now be displayed in the header.',
      });

      setIsUploading(false);
      setLogoPreview(null);
      setSelectedFile(null);
    } else {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select an image file to upload.',
      });
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
                    <div className="w-full h-32 bg-muted rounded-md animate-pulse"></div>
                ) : currentLogoUrl ? (
                    <div className="relative w-full h-32">
                        <Image
                            src={currentLogoUrl}
                            alt="Current Site Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No logo uploaded yet.</p>
                )}
            </div>

            <div className="space-y-2">
                <p className="text-muted-foreground">Select a new image file for the site logo. Recommended aspect ratio: 4:1 (e.g., 512x128 pixels).</p>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {logoPreview && (
              <div className="space-y-4 text-center">
                  <h3 className="font-semibold">New Logo Preview</h3>
                  <div className="relative w-full h-32 mx-auto border rounded-md p-2 flex items-center justify-center">
                      <Image
                          src={logoPreview}
                          alt="Logo Preview"
                          fill
                          className="object-contain"
                      />
                  </div>
              </div>
            )}

            <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Save and Apply Logo"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
