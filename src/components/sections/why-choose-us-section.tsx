"use client";

import { useTranslation } from "@/hooks/use-translation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Globe, Users, Trophy } from "lucide-react";

export default function WhyChooseUsSection() {
    const { t } = useTranslation();

    const features = [
        {
            icon: Globe,
            titleKey: "whyChooseUs.features.0.title",
            descriptionKey: "whyChooseUs.features.0.description",
        },
        {
            icon: Users,
            titleKey: "whyChooseUs.features.1.title",
            descriptionKey: "whyChooseUs.features.1.description",
        },
        {
            icon: Trophy,
            titleKey: "whyChooseUs.features.2.title",
            descriptionKey: "whyChooseUs.features.2.description",
        },
    ];

    return (
        <section className="py-20 md:py-32 bg-muted">
            <div className="container mx-auto px-4 md:px-6">
                <ScrollReveal className="text-center mb-12">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
                        {t("whyChooseUs.title")}
                    </h2>
                    <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                        {t("whyChooseUs.subtitle")}
                    </p>
                </ScrollReveal>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <ScrollReveal key={index} delay={index * 150}>
                            <div className="text-center p-6">
                                <div className="flex justify-center mb-4">
                                     <div className="bg-primary/10 text-primary rounded-full p-4">
                                        <feature.icon className="w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold font-headline text-foreground">{t(feature.titleKey)}</h3>
                                <p className="mt-2 text-muted-foreground">{t(feature.descriptionKey)}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
