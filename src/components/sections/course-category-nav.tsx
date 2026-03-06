
'use client';

import { useTranslation } from '@/hooks/use-translation';
import { courseCategories } from '@/lib/data';
import Link from 'next/link';
import { 
  Briefcase, 
  Languages, 
  Gem, 
  Shirt, 
  Plane, 
  Trophy, 
  type LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mapping from category ID to Lucide icon component
const categoryIcons: Record<(typeof courseCategories)[number]['id'], LucideIcon> = {
  'international-business': Briefcase,
  'languages-cultures': Languages,
  'luxury-hospitality': Gem,
  'fashion': Shirt,
  'aeronautics': Plane,
  'sport-management': Trophy,
};

export default function CourseCategoryNav() {
  const { t } = useTranslation();

  return (
    <nav className="sticky top-28 z-40 bg-secondary/95 backdrop-blur-sm border-y shadow-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center py-3">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {courseCategories.map((category) => {
              const Icon = categoryIcons[category.id];
              return (
                <Link 
                  key={category.id} 
                  href={`#${category.id}`}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ease-in-out",
                    "text-sm font-medium text-secondary-foreground/80 bg-secondary-foreground/5 hover:bg-primary/10 hover:text-primary",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">{t(category.titleKey)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
