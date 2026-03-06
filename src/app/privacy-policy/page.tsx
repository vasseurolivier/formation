
import PageHeroSection from '@/components/sections/page-hero-section';
import LegalContentSection from '@/components/sections/legal-content-section';

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeroSection
        imageId="hero-privacy-policy"
        titleKey="privacyPolicy.title"
        subtitleKey="privacyPolicy.subtitle"
      />
      <LegalContentSection
        titleKey="privacyPolicy.title"
        contentKey="privacyPolicy.content"
       />
    </>
  );
}
