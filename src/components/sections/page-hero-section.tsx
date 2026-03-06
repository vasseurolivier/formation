"use client";

import Image from "next/image";
import { useCustomizableHeroMedia } from "@/hooks/use-customizable-hero-media";
import { useTranslation } from "@/hooks/use-translation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Skeleton } from "@/components/ui/skeleton";

interface PageHeroSectionProps {
  imageId: string;
  titleKey: string;
  subtitleKey: string;
}

export default function PageHeroSection({ imageId, titleKey, subtitleKey }: PageHeroSectionProps) {
  const { t } = useTranslation();
  const media = useCustomizableHeroMedia(imageId);
  const placeholderImage = PlaceHolderImages.find((img) => img.id === imageId);

  return (
    <section className="relative w-full h-screen text-white bg-black">
      {media ? (
            media.type.startsWith('video') ? (
               <video
                key={media.url}
                src={media.url}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
               placeholderImage && (
                <Image
                  src={media.url}
                  alt={placeholderImage.description}
                  data-ai-hint={placeholderImage.imageHint}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
              )
            )
          ) : (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      <div className="relative z-10 flex h-full items-center justify-start text-left">
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
