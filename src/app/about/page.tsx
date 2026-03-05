import AboutSection from '@/components/sections/about-section';
import CtaSection from '@/components/sections/cta-section';
import OurValuesSection from '@/components/sections/our-values-section';
import PageHeroSection from '@/components/sections/page-hero-section';

export default function AboutPage() {
  return (
    <>
      <PageHeroSection 
        imageId="hero-about"
        titleKey="aboutSection.title"
        subtitleKey="aboutSection.subtitle"
      />
      <AboutSection />
      <OurValuesSection />
      <CtaSection />
    </>
  );
}
