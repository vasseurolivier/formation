'use client';

import { useState, useEffect } from 'react';
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

const STORAGE_KEY = 'customImages';

type ImageGroup = {
  title: string;
  images: ImagePlaceholder[];
};

export default function ImageManagerPage() {
  const { toast } = useToast();
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});

  useEffect(() => {
    try {
      const storedImages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      setCustomImages(storedImages);
    } catch (error) {
      console.error("Failed to parse custom images from localStorage", error);
      setCustomImages({});
    }
  }, []);
  
  const otherImageGroups: ImageGroup[] = [
    {
      title: 'Course Images',
      images: PlaceHolderImages.filter(img => img.id.startsWith('course-')),
    },
    {
      title: 'Testimonial Images',
      images: PlaceHolderImages.filter(img => img.id.startsWith('testimonial-')),
    },
    {
      title: 'General Page Images',
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
    const dataUrl = previews[id];
    if (dataUrl) {
      const updatedImages = { ...customImages, [id]: dataUrl };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedImages));
      setCustomImages(updatedImages);
      
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
        title: 'Image successfully uploaded!',
        description: `The image for "${PlaceHolderImages.find(i=>i.id===id)?.description}" has been updated.`,
      });
      
      window.dispatchEvent(new Event('storage'));
    } else {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select an image file to upload.',
      });
    }
  };

  const getImageUrl = (image: ImagePlaceholder) => {
    return previews[image.id] || customImages[image.id] || image.imageUrl;
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
              <ImageUp />
              Website Image Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Upload and manage the images used across the website. Changes are saved locally in your browser.
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
                        <Card key={image.id} className="overflow-hidden">
                          <CardHeader className="p-4">
                            <CardTitle className="text-base font-medium">{image.description}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 space-y-4">
                            <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                              <Image
                                src={getImageUrl(image)}
                                alt={image.description}
                                fill
                                className="object-cover"
                              />
                              {customImages[image.id] && !previews[image.id] && (
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
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(image.id, e)}
                                />
                                <Button
                                    onClick={() => handleUpload(image.id)}
                                    disabled={!selectedFiles[image.id]}
                                    className="w-full"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Save Image
                                </Button>
                            </div>
                          </CardContent>
                        </Card>
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
