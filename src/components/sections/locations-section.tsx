"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { campusLocations } from "@/lib/data";

export default function LocationsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-32 bg-muted">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            {t("locations.sectionTitle")}
          </h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            {t("locations.sectionSubtitle")}
          </p>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {campusLocations.map((location, index) => (
            <ScrollReveal key={location.id} delay={index * 150}>
              <Card className="text-center h-full border bg-card hover:bg-accent hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit">
                    <MapPin className="w-8 h-8" />
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-headline text-xl font-semibold text-foreground">{location.name}</h3>
                  <p className="text-muted-foreground mt-2">{t(location.descriptionKey)}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="/locations">
                    {t("locations.cta")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
