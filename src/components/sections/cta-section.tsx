"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
    const { t } = useTranslation();

    return (
        <section className="bg-muted py-20">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <ScrollReveal>
                    <h2 className="font-headline text-3xl font-bold text-primary">
                        {t("cta.title")}
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        {t("cta.subtitle")}
                    </p>
                    <div className="mt-8">
                        <Button asChild size="lg">
                            <Link href="/contact">
                                {t("cta.button")}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
