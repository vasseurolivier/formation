
'use client';

import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { courses } from '@/lib/data';
import PageHeroSection from '@/components/sections/page-hero-section';
import CourseDetailSection from '@/components/sections/course-detail-section';
import CourseGallerySection from '@/components/sections/course-gallery-section';
import CtaSection from '@/components/sections/cta-section';

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    notFound();
  }

  return (
    <>
      <PageHeroSection
        imageId={course.heroImageId}
        titleKey={course.titleKey}
        subtitleKey={course.shortDescriptionKey}
      />
      <CourseDetailSection course={course} />
      <CourseGallerySection course={course} />
      <CtaSection />
    </>
  );
}

    