"use client";

import Image from "next/image";
import type { Course, CourseCategoryId } from "@/lib/data";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface CourseCardProps {
  course: Course;
  categoryTitle: string;
}

export default function CourseCard({ course, categoryTitle }: CourseCardProps) {
  const { t } = useTranslation();
  const placeholderImage = PlaceHolderImages.find((img) => img.id === course.imageId);

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 border bg-card hover:bg-accent">
      <CardHeader className="p-0">
        <div className="relative h-56 w-full">
          {placeholderImage && (
             <Image
              src={placeholderImage.imageUrl}
              alt={placeholderImage.description}
              data-ai-hint={placeholderImage.imageHint}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4">
             <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/50">{categoryTitle}</Badge>
          </div>
        </div>
        <div className="p-6">
          <CardTitle className="font-headline text-xl text-foreground">
            {t(course.titleKey)}
          </CardTitle>
        </div>
      </CardHeader>
    </Card>
  );
}
