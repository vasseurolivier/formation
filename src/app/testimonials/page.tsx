import TestimonialsSection from '@/components/sections/testimonials-section';
import PageHeroSection from '@/components/sections/page-hero-section';

export default function TestimonialsPage() {
  return (
    <>
      <PageHeroSection
        imageId="hero-testimonials"
        titleKey="testimonialsSection.title"
        subtitleKey="testimonialsSection.subtitle"
      />
      <TestimonialsSection />
    </>
  );
}
