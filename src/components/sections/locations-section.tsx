"use client";

import { useTranslation } from "@/hooks/use-translation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function LocationsSection() {
  const { t } = useTranslation();

  const locations = [
    { name: "Evron", key: "locations.evron" },
    { name: "Sainte-Tulle", key: "locations.sainteTulle" },
    { name: "Sainte-Bazeille", key: "locations.sainteBazeille" },
  ];

  return (
    <section className="py-20 md:py-32 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            {t("locations.title")}
          </h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            {t("locations.subtitle")}
          </p>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <ScrollReveal key={location.name} delay={index * 150}>
              <Card className="text-center h-full border bg-card hover:bg-accent hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit">
                    <MapPin className="w-8 h-8" />
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-headline text-xl font-semibold text-foreground">{location.name}</h3>
                  <p className="text-muted-foreground mt-2">{t(location.key)}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
