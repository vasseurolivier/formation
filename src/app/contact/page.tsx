import ContactSection from '@/components/sections/contact-section';
import PageHeroSection from '@/components/sections/page-hero-section';

export default function ContactPage() {
  return (
    <>
      <PageHeroSection
        imageId="hero-contact"
        titleKey="contactSection.title"
        subtitleKey="contactSection.subtitle"
      />
      <ContactSection />
    </>
  );
}
