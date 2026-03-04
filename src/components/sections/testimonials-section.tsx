"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslation } from "@/hooks/use-translation";
import { testimonials } from "@/lib/data";
import TestimonialCard from "@/components/testimonial-card";
import { ScrollReveal } from "../scroll-reveal";

export default function TestimonialsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-32 bg-muted">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal delay={200}>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
        </ScrollReveal>
      </div>
    </section>
  );
}
