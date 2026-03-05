
'use client';
import Image from 'next/image';
import { useCustomizableImage } from '@/hooks/use-customizable-image';
import type { Course } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ScrollReveal } from '@/components/scroll-reveal';
import { useTranslation } from '@/hooks/use-translation';
import { Skeleton } from '@/components/ui/skeleton';

export default function CourseGallerySection({ course }: { course: Course }) {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-24 bg-muted">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            {t('coursePage.galleryTitle')}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {course.galleryImageIds.map((id, index) => (
            <GalleryImage key={id} imageId={id} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryImage({ imageId, index }: { imageId: string; index: number }) {
  const imageUrl = useCustomizableImage(imageId);
  const placeholder = PlaceHolderImages.find((p) => p.id === imageId);

  return (
    <ScrollReveal delay={index * 100}>
      <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg group">
        {imageUrl && placeholder ? (
            <Image
            src={imageUrl}
            alt={placeholder.description}
            data-ai-hint={placeholder.imageHint}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
        ) : (
            <Skeleton className="w-full h-full" />
        )}
      </div>
    </ScrollReveal>
  );
}
