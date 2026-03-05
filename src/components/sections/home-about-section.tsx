"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useCustomizableImage } from "@/hooks/use-customizable-image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HomeAboutSection() {
  const { t } = useTranslation();
  const imageUrl = useCustomizableImage("about-us-image");
  const aboutImage = PlaceHolderImages.find(img => img.id === "about-us-image");

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            {t("homeAbout.title")}
          </h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            {t("homeAbout.subtitle")}
          </p>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal delay={100}>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl shadow-primary/10">
              {imageUrl && aboutImage && (
                <Image
                  src={imageUrl}
                  alt={aboutImage.description}
                  data-ai-hint={aboutImage.imageHint}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </ScrollReveal>
          <div className="space-y-6">
            <ScrollReveal delay={200}>
              <p className="text-lg text-muted-foreground">
                {t("homeAbout.paragraph")}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
               <Button asChild>
                <Link href="/about">
                    {t("homeAbout.cta")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
