"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import { campusLocations } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function CampusesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            {t("locations.pageTitle")}
          </h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
            {t("locations.pageSubtitle")}
          </p>
        </ScrollReveal>

        <div className="space-y-20">
          {campusLocations.map((location, index) => {
            const placeholderImage = PlaceHolderImages.find(
              (img) => img.id === location.imageId
            );
            const isReversed = index % 2 !== 0;
            return (
              <ScrollReveal key={location.id}>
                <div
                  className={`grid md:grid-cols-2 gap-12 items-center ${
                    isReversed ? "md:grid-flow-col-dense" : ""
                  }`}
                >
                  <div className={`relative aspect-video rounded-lg overflow-hidden shadow-2xl shadow-primary/10 ${isReversed ? 'md:col-start-2' : ''}`}>
                    {placeholderImage && (
                      <Image
                        src={placeholderImage.imageUrl}
                        alt={placeholderImage.description}
                        data-ai-hint={placeholderImage.imageHint}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className={`space-y-4 ${isReversed ? 'md:col-start-1' : ''}`}>
                    <h3 className="font-headline text-2xl md:text-3xl font-bold text-primary">
                      {location.name}
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      {t(location.detailsKey)}
                    </p>
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
