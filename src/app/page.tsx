import CtaSection from '@/components/sections/cta-section';
import HeroSection from '@/components/sections/hero-section';
import LocationsSection from '@/components/sections/locations-section';
import WhyChooseUsSection from '@/components/sections/why-choose-us-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhyChooseUsSection />
      <LocationsSection />
      <CtaSection />
    </>
  );
}
