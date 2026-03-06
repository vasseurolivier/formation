"use client";

import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import Link from "next/link";
import Image from "next/image";
import { useCustomizableHeroMedia } from "@/hooks/use-customizable-hero-media";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSection() {
  const { t } = useTranslation();
  const imageId = "hero-home";
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative z-10 flex h-full items-end justify-start pb-20 text-left md:pb-24">
        <div className="container px-4 md:px-6">
          <ScrollReveal>
            <h1 className="font-headline max-w-xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              {t("hero.title")}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-4 max-w-xl text-base text-white/90 md:text-lg">
              {t("hero.subtitle")}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/courses">
                  {t("hero.cta")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
