"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import { campusLocations, type CampusLocation } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useCustomizableImage } from "@/hooks/use-customizable-image";
import { Skeleton } from "@/components/ui/skeleton";

function CampusImage({ imageId, description, imageHint }: { imageId: string, description: string, imageHint: string }) {
  const imageUrl = useCustomizableImage(imageId);
  
  if (!imageUrl) return <Skeleton className="w-full h-full absolute" />;

  return (
    <Image
      src={imageUrl}
      alt={description}
      data-ai-hint={imageHint}
      fill
      className="object-cover"
    />
  );
}

export default function CampusesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="space-y-24">
          {campusLocations.map((location: CampusLocation, index) => {
            const mainPlaceholderImage = PlaceHolderImages.find(
              (img) => img.id === location.mainImageId
            );
            const isReversed = index % 2 !== 0;
            return (
              <ScrollReveal key={location.id}>
                <div
                  className={`grid md:grid-cols-2 gap-12 items-center ${
                    isReversed ? "md:grid-flow-col-dense" : ""
                  }`}
                >
                  <div className={`${isReversed ? 'md:col-start-2' : ''}`}>
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl shadow-primary/10">
                      {mainPlaceholderImage && (
                        <CampusImage 
                          imageId={mainPlaceholderImage.id}
                          description={mainPlaceholderImage.description}
                          imageHint={mainPlaceholderImage.imageHint}
                        />
                      )}
                    </div>
                  </div>
                  <div className={`space-y-4 ${isReversed ? 'md:col-start-1' : ''}`}>
                    <h3 className="font-headline text-2xl md:text-3xl font-bold text-primary">
                      {location.name}
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      {t(location.detailsKey)}
                    </p>
                    
                    <div className="pt-4">
                      <h4 className="font-semibold text-lg text-foreground mb-4">En images...</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {location.galleryImageIds.map(imageId => {
                          const galleryPlaceholder = PlaceHolderImages.find(img => img.id === imageId);
                          if (!galleryPlaceholder) return null;
                          return (
                            <div key={imageId} className="relative aspect-video rounded-md overflow-hidden shadow-lg transition-transform hover:scale-105">
                              <CampusImage 
                                imageId={galleryPlaceholder.id}
                                description={galleryPlaceholder.description}
                                imageHint={galleryPlaceholder.imageHint}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
