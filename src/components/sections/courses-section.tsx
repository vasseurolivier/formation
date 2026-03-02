"use client";

import { useTranslation } from "@/hooks/use-translation";
import { courses, courseCategories } from "@/lib/data";
import CourseCard from "@/components/course-card";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function CoursesSection() {
  const { t } = useTranslation();

  return (
    <section id="courses" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            {t("coursesSection.title")}
          </h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            {t("coursesSection.subtitle")}
          </p>
        </ScrollReveal>

        {courseCategories.map((category) => (
          <div key={category.id} className="mb-16">
            <ScrollReveal>
              <h3 className="font-headline text-2xl md:text-3xl font-semibold mb-8 text-foreground">
                {t(category.titleKey)}
              </h3>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {courses
                .filter((course) => course.categoryId === category.id)
                .map((course, index) => (
                  <ScrollReveal key={course.id} delay={index * 100}>
                    <CourseCard course={course} categoryTitle={t(category.titleKey)} />
                  </ScrollReveal>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
