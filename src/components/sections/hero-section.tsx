"use client";

import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollReveal } from "@/components/scroll-reveal";

const Globe = dynamic(
  () => import("@/components/globe").then((mod) => mod.Globe),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full absolute inset-0" />,
  }
);

export default function HeroSection() {
  const { t } = useTranslation();

  const handleScrollToCourses = () => {
    const coursesSection = document.getElementById("courses");
    if (coursesSection) {
      window.scrollTo({
        top: coursesSection.offsetTop - 80, // Offset for header
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="home" className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Globe />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
      <div className="relative z-10 flex h-full items-center justify-center text-center">
        <div className="container px-4 md:px-6">
          <ScrollReveal>
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              {t("hero.title")}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground md:text-xl">
              {t("hero.subtitle")}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <div className="mt-10">
              <Button size="lg" onClick={handleScrollToCourses}>
                {t("hero.cta")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
