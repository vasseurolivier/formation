"use client";

import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import Link from "next/link";
import Image from "next/image";
import { useCustomizableHeroMedia } from "@/hooks/use-customizable-hero-media";
import { PlaceHolderImages } from "@/lib/placeholder-images";

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
            />
          )
        )
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-foreground/30" />
      <div className="relative z-10 flex h-full items-center justify-center text-center">
        <div className="container px-4 md:px-6">
          <ScrollReveal>
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              {t("hero.title")}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-white/90 md:text-xl">
              {t("hero.subtitle")}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <div className="mt-10">
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
