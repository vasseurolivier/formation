"use client";

import { useTranslation } from "@/hooks/use-translation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Award, GraduationCap, Languages } from "lucide-react";

export default function CoursesIntroSection() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: GraduationCap,
      value: "10",
      labelKey: "coursesIntro.stats.programs",
    },
    {
      icon: Languages,
      value: "3",
      labelKey: "coursesIntro.stats.languages",
    },
    {
      icon: Award,
      value: "10+",
      labelKey: "coursesIntro.stats.partners",
    },
  ];

  return (
    <section className="py-6 md:py-8 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-headline text-2xl md:text-3xl font-bold">
              {t("coursesIntro.title")}
            </h2>
            <p className="mt-2 text-base text-primary-foreground/80">
              {t("coursesIntro.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={100 * index} className="text-center">
              <div className="flex justify-center mb-3">
                  <div className="bg-primary-foreground/10 rounded-full p-3">
                      <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
              </div>
              <p className="text-3xl font-bold text-primary-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-primary-foreground/80">{t(stat.labelKey)}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
