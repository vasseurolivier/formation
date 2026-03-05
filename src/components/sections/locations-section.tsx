"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { campusLocations } from "@/lib/data";
import { useCustomizableImage } from "@/hooks/use-customizable-image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Skeleton } from "@/components/ui/skeleton";

export default function LocationsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-32 bg-muted">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            {t("locations.sectionTitle")}
          </h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            {t("locations.sectionSubtitle")}
          </p>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {campusLocations.map((location, index) => {
            const placeholder = PlaceHolderImages.find(p => p.id === location.mainImageId);
            const imageUrl = useCustomizableImage(location.mainImageId);

            return (
              <ScrollReveal key={location.id} delay={index * 150}>
                <Link href="/locations" className="block group">
                  <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                    {imageUrl && placeholder ? (
                      <Image
                        src={imageUrl}
                        alt={placeholder.description}
                        data-ai-hint={placeholder.imageHint}
                        fill
                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                      />
                    ) : (
                      <Skeleton className="w-full h-full" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-all duration-300 group-hover:from-black/80" />
                    <div className="relative h-full flex flex-col justify-end p-6 text-white">
                      <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full w-fit mb-4 border border-white/20">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-headline text-2xl font-semibold">{location.name}</h3>
                      <p className="text-white/90 mt-2 text-sm">{t(location.descriptionKey)}</p>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
        <ScrollReveal className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="/locations">
                    {t("locations.cta")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
