'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';

export default function LogoUploaderPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

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

  const handleUpload = () => {
    if (logoPreview) {
      localStorage.setItem('siteLogo', logoPreview);
      toast({
        title: 'Logo successfully uploaded!',
        description: 'The new logo will now be displayed in the header.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select an image file to upload.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pt-24 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
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
            <div className="space-y-2">
                <p className="text-muted-foreground">Select an image file for the site logo. Recommended size: 128x32 pixels.</p>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {logoPreview && (
              <div className="space-y-4 text-center">
                  <h3 className="font-semibold">Logo Preview</h3>
                  <div className="relative w-48 h-12 mx-auto border rounded-md p-2 flex items-center justify-center">
                      <Image
                          src={logoPreview}
                          alt="Logo Preview"
                          fill
                          className="object-contain"
                      />
                  </div>
              </div>
            )}

            <Button onClick={handleUpload} disabled={!selectedFile} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Save and Apply Logo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
