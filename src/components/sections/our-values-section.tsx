"use client";

import { useTranslation } from "@/hooks/use-translation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Gem, Globe, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OurValuesSection() {
    const { t } = useTranslation();

    const values = [
        {
            icon: Gem,
            titleKey: "ourValues.values.0.title",
            descriptionKey: "ourValues.values.0.description",
        },
        {
            icon: Globe,
            titleKey: "ourValues.values.1.title",
            descriptionKey: "ourValues.values.1.description",
        },
        {
            icon: Lightbulb,
            titleKey: "ourValues.values.2.title",
            descriptionKey: "ourValues.values.2.description",
        },
    ];

    return (
        <section className="py-20 md:py-32 bg-muted">
            <div className="container mx-auto px-4 md:px-6">
                <ScrollReveal className="text-center mb-12">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
                        {t("ourValues.title")}
                    </h2>
                    <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                        {t("ourValues.subtitle")}
                    </p>
                </ScrollReveal>

                <div className="grid md:grid-cols-3 gap-8">
                    {values.map((value, index) => (
                        <ScrollReveal key={index} delay={index * 150}>
                             <Card className="text-center h-full border bg-card hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-primary/10 text-primary rounded-full p-4">
                                            <value.icon className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-bold font-headline text-foreground">{t(value.titleKey)}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mt-2 text-muted-foreground">{t(value.descriptionKey)}</p>
                                </CardContent>
                            </Card>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
