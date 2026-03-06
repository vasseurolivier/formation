
'use client';

import { useTranslation } from '@/hooks/use-translation';
import type { Course } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, CheckSquare, Target, Bed, Languages, Euro } from 'lucide-react';
import { ScrollReveal } from '../scroll-reveal';

export default function CourseDetailSection({ course }: { course: Course }) {
  const { t } = useTranslation();

  const details = [
    { icon: Clock, title: t('coursePage.duration'), key: course.durationKey },
    { icon: Users, title: t('coursePage.targetAudience'), key: course.targetAudienceKey },
    { icon: CheckSquare, title: t('coursePage.prerequisites'), key: course.prerequisitesKey },
    { icon: Target, title: t('coursePage.careerOutcomes'), key: course.careerOutcomesKey },
    { icon: Euro, title: t('coursePage.price'), key: course.priceKey },
    { icon: Bed, title: t('coursePage.formula'), key: 'coursePage.formulaValue' },
  ];

  if (course.languageHighlight) {
    details.splice(1, 0, {
      icon: Languages,
      title: t('coursePage.languages'),
      key: 'coursePage.languagesValue',
    });
  }

  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <div className="md:col-span-2 space-y-8">
             <ScrollReveal>
                <h2 className="text-3xl font-bold text-primary font-headline">{t('coursePage.aboutTitle')}</h2>
                <p className="text-lg text-muted-foreground mt-4 whitespace-pre-wrap">{t(course.fullDescriptionKey)}</p>
             </ScrollReveal>
          </div>
          <ScrollReveal delay={200}>
            <Card className="sticky top-28">
              <CardHeader>
                <CardTitle>{t('coursePage.keyInfoTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {details.map((detail) => (
                  <div key={detail.title} className="flex items-start gap-4">
                    <detail.icon className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">{detail.title}</h4>
                      <p className="text-sm text-muted-foreground">{t(detail.key)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
