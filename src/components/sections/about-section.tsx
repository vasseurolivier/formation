"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useCustomizableImage } from "@/hooks/use-customizable-image";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutSection() {
  const { t } = useTranslation();
  const imageUrl = useCustomizableImage("about-us-image");
  const aboutImage = PlaceHolderImages.find(img => img.id === "about-us-image");

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl shadow-primary/10">
              {imageUrl && aboutImage ? (
                <Image
                  src={imageUrl}
                  alt={aboutImage.description}
                  data-ai-hint={aboutImage.imageHint}
                  fill
                  className="object-cover"
                />
              ) : (
                <Skeleton className="w-full h-full" />
              )}
            </div>
          </ScrollReveal>
          <div className="space-y-6">
            <ScrollReveal delay={100}>
              <p className="text-lg text-muted-foreground">
                {t("aboutSection.paragraph1")}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-lg text-muted-foreground">
                {t("aboutSection.paragraph2")}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
