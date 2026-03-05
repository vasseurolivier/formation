import CtaSection from '@/components/sections/cta-section';
import HeroSection from '@/components/sections/hero-section';
import LocationsSection from '@/components/sections/locations-section';
import WhyChooseUsSection from '@/components/sections/why-choose-us-section';
import CoursesPreviewSection from '@/components/sections/courses-preview-section';
import HomeAboutSection from '@/components/sections/home-about-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <HomeAboutSection />
      <WhyChooseUsSection />
      <CoursesPreviewSection />
      <LocationsSection />
      <CtaSection />
    </>
  );
}
