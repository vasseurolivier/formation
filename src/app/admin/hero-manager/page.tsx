'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Film, Upload, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

const STORAGE_KEY = 'customHeroMedia';

type CustomMedia = {
  url: string;
  type: string;
};

export default function HeroManagerPage() {
  const { toast } = useToast();
  const [customMedia, setCustomMedia] = useState<Record<string, CustomMedia>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});

  const heroImages = PlaceHolderImages.filter(img => img.id.startsWith('hero-'));

  useEffect(() => {
    try {
      const storedMedia = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      setCustomMedia(storedMedia);
    } catch (error) {
      console.error("Failed to parse custom media from localStorage", error);
      setCustomMedia({});
    }
  }, []);

  const handleFileChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [id]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [id]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = (id: string) => {
    const file = selectedFiles[id];
    const dataUrl = previews[id];
    if (file && dataUrl) {
      const newMedia: CustomMedia = { url: dataUrl, type: file.type };
      const updatedMedia = { ...customMedia, [id]: newMedia };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMedia));
      setCustomMedia(updatedMedia);
      
      setPreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[id];
        return newPreviews;
      });
      setSelectedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[id];
        return newFiles;
      });

      toast({
        title: 'Media successfully uploaded!',
        description: `The hero media for "${heroImages.find(i=>i.id===id)?.description}" has been updated.`,
      });
      
      window.dispatchEvent(new Event('storage'));
    } else {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a media file to upload.',
      });
    }
  };

  const getMedia = (image: ImagePlaceholder): CustomMedia => {
    const previewUrl = previews[image.id];
    const custom = customMedia[image.id];

    if (previewUrl && selectedFiles[image.id]) {
        return { url: previewUrl, type: selectedFiles[image.id].type };
    }
    if (custom) {
        return custom;
    }
    return { url: image.imageUrl, type: 'image' };
  };

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
            <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
              <Film />
              Hero Section Media Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Upload custom images or videos for the main hero sections of your site. Videos are not recommended for production sites due to browser storage limits.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {heroImages.map(image => {
                const media = getMedia(image);
                const isVideo = media.type.startsWith('video');
                return (
                  <Card key={image.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base font-medium">{image.description}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-4">
                      <div className="relative aspect-video w-full rounded-md overflow-hidden border bg-black">
                        {isVideo ? (
                            <video
                                key={media.url}
                                src={media.url}
                                controls
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Image
                                src={media.url}
                                alt={image.description}
                                fill
                                className="object-cover"
                            />
                        )}
                        {customMedia[image.id] && !previews[image.id] && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Custom
                            </div>
                        )}
                      </div>
                      <div className="space-y-2">
                          <Input
                              id={`file-${image.id}`}
                              type="file"
                              accept="image/*,video/mp4,video/webm"
                              onChange={(e) => handleFileChange(image.id, e)}
                          />
                          <Button
                              onClick={() => handleUpload(image.id)}
                              disabled={!selectedFiles[image.id]}
                              className="w-full"
                          >
                              <Upload className="mr-2 h-4 w-4" />
                              Save Media
                          </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
