import CoursesSection from '@/components/sections/courses-section';
import PageHeroSection from '@/components/sections/page-hero-section';

export default function CoursesPage() {
  return (
    <>
      <PageHeroSection
        imageId="hero-courses"
        titleKey="coursesSection.title"
        subtitleKey="coursesSection.subtitle"
      />
      <CoursesSection />
    </>
  );
}
