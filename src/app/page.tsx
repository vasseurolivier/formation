import Header from '@/components/header';
import Footer from '@/components/footer';
import HeroSection from '@/components/sections/hero-section';
import CoursesSection from '@/components/sections/courses-section';
import AboutSection from '@/components/sections/about-section';
import TestimonialsSection from '@/components/sections/testimonials-section';
import ContactSection from '@/components/sections/contact-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <CoursesSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
