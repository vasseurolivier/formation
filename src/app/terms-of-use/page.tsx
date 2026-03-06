
import PageHeroSection from '@/components/sections/page-hero-section';
import LegalContentSection from '@/components/sections/legal-content-section';

export default function TermsOfUsePage() {
  return (
    <>
      <PageHeroSection
        imageId="hero-terms-of-use"
        titleKey="termsOfUse.title"
        subtitleKey="termsOfUse.subtitle"
      />
      <LegalContentSection
        titleKey="termsOfUse.title"
        contentKey="termsOfUse.content"
       />
    </>
  );
}
