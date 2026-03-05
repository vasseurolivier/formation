"use client";

import { useTranslation } from "@/hooks/use-translation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Award, Briefcase, GraduationCap } from "lucide-react";

export default function CoursesIntroSection() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: GraduationCap,
      value: "15+",
      labelKey: "coursesIntro.stats.programs",
    },
    {
      icon: Briefcase,
      value: "90%",
      labelKey: "coursesIntro.stats.placement",
    },
    {
      icon: Award,
      value: "25+",
      labelKey: "coursesIntro.stats.partners",
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-muted">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
              {t("coursesIntro.title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("coursesIntro.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={100 * index}>
              <Card className="text-center h-full bg-card">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                      <div className="bg-primary/10 text-primary rounded-full p-4">
                          <stat.icon className="w-8 h-8" />
                      </div>
                  </div>
                  <p className="text-4xl font-bold text-foreground">{stat.value}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t(stat.labelKey)}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
