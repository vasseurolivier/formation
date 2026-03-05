"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { courses, courseCategories } from "@/lib/data";
import CourseCard from "@/components/course-card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CoursesPreviewSection() {
  const { t } = useTranslation();

  // Get first 4 courses
  const previewCourses = courses.slice(0, 4);

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            {t("coursesPreview.title")}
          </h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            {t("coursesPreview.subtitle")}
          </p>
        </ScrollReveal>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {previewCourses.map((course, index) => {
                const category = courseCategories.find(c => c.id === course.categoryId);
                return (
                    <ScrollReveal key={course.id} delay={index * 100} className="h-full">
                        <CourseCard course={course} categoryTitle={category ? t(category.titleKey) : ""} />
                    </ScrollReveal>
                )
            })}
        </div>

        <ScrollReveal className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="/courses">
                    {t("coursesPreview.cta")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </ScrollReveal>

      </div>
    </section>
  );
}
