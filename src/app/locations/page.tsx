import CampusesSection from '@/components/sections/campuses-section';
import PageHeroSection from '@/components/sections/page-hero-section';

export default function LocationsPage() {
  return (
    <>
      <PageHeroSection
        imageId="hero-locations"
        titleKey="locations.pageTitle"
        subtitleKey="locations.pageSubtitle"
      />
      <CampusesSection />
    </>
  );
}
