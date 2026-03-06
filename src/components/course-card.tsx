
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
import { Skeleton } from "@/components/ui/skeleton";

interface CourseCardProps {
  course: Course;
  categoryTitle: string;
}

export default function CourseCard({ course, categoryTitle }: CourseCardProps) {
  const { t } = useTranslation();
  const imageUrl = useCustomizableImage(course.thumbnailImageId);
  const placeholderImage = PlaceHolderImages.find((img) => img.id === course.thumbnailImageId);
  const iconUrl = useCustomizableImage(course.iconMediaId);
  const iconPlaceholder = PlaceHolderImages.find((img) => img.id === course.iconMediaId);

  return (
    <Link href={`/courses/${course.id}`} className="block group h-full">
        <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out border bg-card flex flex-col group/card hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20">
            <div className="relative h-56 w-full flex-shrink-0 overflow-hidden">
                {imageUrl && placeholderImage ? (
                    <Image
                      src={imageUrl}
                      alt={placeholderImage.description}
                      data-ai-hint={placeholderImage.imageHint}
                      fill
                      className="object-cover transition-all duration-500 ease-in-out group-hover/card:scale-110 group-hover/card:blur-sm group-hover/card:brightness-75"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                ) : (
                    <Skeleton className="w-full h-full" />
                )}
                
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0 group-hover/card:opacity-100">
                  {iconUrl && iconPlaceholder && (
                    <Image
                      src={iconUrl}
                      alt={iconPlaceholder.description}
                      width={80}
                      height={80}
                      className="transition-transform duration-500 ease-out group-hover/card:scale-110"
                    />
                  )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent transition-all duration-300 opacity-80 group-hover/card:opacity-100" />
                
                 {course.languageHighlight && (
                  <Badge variant="destructive" className="absolute top-4 right-4 border-destructive-foreground/20 backdrop-blur-sm z-10">
                    {t('courseCard.languageBadge')}
                  </Badge>
                )}

                <div className="absolute bottom-4 left-4 z-10">
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/50">{categoryTitle}</Badge>
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow bg-card">
                <h3 className="font-headline text-xl text-foreground mb-2">
                    {t(course.titleKey)}
                </h3>
                <p className="text-muted-foreground text-sm flex-grow">
                    {t(course.shortDescriptionKey)}
                </p>
                <div className="text-sm text-primary font-semibold flex items-center mt-4 transition-all duration-300 opacity-0 group-hover/card:opacity-100 translate-y-2 group-hover/card:translate-y-0">
                    En savoir plus <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/card:translate-x-1" />
                </div>
            </div>
        </Card>
    </Link>
  );
}
