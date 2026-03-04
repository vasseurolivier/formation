"use client";

import Image from "next/image";
import { useCustomizableImage } from "@/hooks/use-customizable-image";
import { useTranslation } from "@/hooks/use-translation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ScrollReveal } from "@/components/scroll-reveal";

interface PageHeroSectionProps {
  imageId: string;
  titleKey: string;
  subtitleKey: string;
}

export default function PageHeroSection({ imageId, titleKey, subtitleKey }: PageHeroSectionProps) {
  const { t } = useTranslation();
  const imageUrl = useCustomizableImage(imageId);
  const placeholderImage = PlaceHolderImages.find((img) => img.id === imageId);

  return (
    <section className="relative w-full h-[60vh] min-h-[450px] text-white">
      {imageUrl && placeholderImage && (
        <Image
          src={imageUrl}
          alt={placeholderImage.description}
          data-ai-hint={placeholderImage.imageHint}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent" />
      <div className="relative z-10 flex h-full items-end pb-20">
        <div className="container px-4 md:px-6">
          <ScrollReveal>
            <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              {t(titleKey)}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-4 max-w-2xl text-lg text-white/90 md:text-xl">
              {t(subtitleKey)}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
