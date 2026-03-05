"use client";

import Image from "next/image";
import type { Course } from "@/lib/data";
import { useTranslation } from "@/hooks/use-translation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useCustomizableImage } from "@/hooks/use-customizable-image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CourseCardProps {
  course: Course;
  categoryTitle: string;
}

export default function CourseCard({ course, categoryTitle }: CourseCardProps) {
  const { t } = useTranslation();
  const imageUrl = useCustomizableImage(course.thumbnailImageId);
  const placeholderImage = PlaceHolderImages.find((img) => img.id === course.thumbnailImageId);

  return (
    <Link href={`/courses/${course.id}`} className="block group h-full">
        <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20 border bg-card hover:bg-accent flex flex-col">
            <div className="relative h-56 w-full flex-shrink-0">
                {imageUrl && placeholderImage && (
                    <Image
                    src={imageUrl}
                    alt={placeholderImage.description}
                    data-ai-hint={placeholderImage.imageHint}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
                <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/50">{categoryTitle}</Badge>
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-headline text-xl text-foreground mb-2">
                    {t(course.titleKey)}
                </h3>
                <div className="flex-grow" />
                <p className="text-sm text-primary font-semibold flex items-center mt-2">
                    En savoir plus <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </p>
            </div>
        </Card>
    </Link>
  );
}
