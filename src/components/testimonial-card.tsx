"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { Testimonial } from "@/lib/data";
import { useTranslation } from "@/hooks/use-translation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useCustomizableImage } from "@/hooks/use-customizable-image";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { t } = useTranslation();
  const imageUrl = useCustomizableImage(testimonial.imageId);
  const placeholderImage = PlaceHolderImages.find(
    (img) => img.id === testimonial.imageId
  );

  return (
    <Card className="h-full border bg-card hover:bg-accent transition-colors">
      <CardContent className="flex h-full flex-col justify-between p-6">
        <blockquote className="italic text-foreground/80">
          “{t(testimonial.quoteKey)}”
        </blockquote>
        <div className="mt-6 flex items-center gap-4">
          <Avatar>
            {imageUrl && placeholderImage && (
                <AvatarImage 
                    src={imageUrl} 
                    alt={t(testimonial.authorKey)} 
                    data-ai-hint={placeholderImage.imageHint}
                />
            )}
            <AvatarFallback>{t(testimonial.authorKey).charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">
              {t(testimonial.authorKey)}
            </p>
            <p className="text-sm text-muted-foreground">
              {t(testimonial.originKey)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
