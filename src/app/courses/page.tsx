import CoursesIntroSection from '@/components/sections/courses-intro-section';
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
      <CoursesIntroSection />
      <CoursesSection />
    </>
  );
}
