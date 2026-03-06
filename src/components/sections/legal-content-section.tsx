
'use client';

import { useTranslation } from '@/hooks/use-translation';
import { ScrollReveal } from '../scroll-reveal';

interface LegalContentSectionProps {
    titleKey: string;
    contentKey: string;
}

export default function LegalContentSection({ titleKey, contentKey }: LegalContentSectionProps) {
  const { t } = useTranslation();

  const title = t(titleKey);
  const content = t(contentKey);
  const contentParts = content.split('\n');

  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
            <ScrollReveal>
                <h2 className="text-3xl font-bold text-primary font-headline mb-8">{title}</h2>
            </ScrollReveal>
            <div className="space-y-6 text-muted-foreground">
                {contentParts.map((part, index) => {
                    const headingMatch = part.match(/## (.*) ##/);
                    if (headingMatch) {
                        return (
                             <ScrollReveal delay={index * 50} key={index}>
                                <h3 className="text-xl font-semibold text-foreground pt-4">{headingMatch[1]}</h3>
                            </ScrollReveal>
                        )
                    }
                    if (part.trim() === '') {
                        return null;
                    }
                    return (
                        <ScrollReveal delay={index * 50} key={index}>
                            <p>{part}</p>
                        </ScrollReveal>
                    )
                })}
            </div>
        </div>
      </div>
    </section>
  );
}
