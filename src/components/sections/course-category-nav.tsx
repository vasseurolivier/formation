'use client';

import { useTranslation } from '@/hooks/use-translation';
import { courseCategories } from '@/lib/data';
import Link from 'next/link';

export default function CourseCategoryNav() {
  const { t } = useTranslation();

  return (
    <nav className="sticky top-28 z-40 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center py-4 overflow-x-auto">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {courseCategories.map((category) => (
              <Link 
                key={category.id} 
                href={`#${category.id}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap"
              >
                {t(category.titleKey)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
