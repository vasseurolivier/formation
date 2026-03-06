
"use client";

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

const categoryIcons: Record<(typeof courseCategories)[number]['id'], LucideIcon> = {
  'international-business': Briefcase,
  'languages-cultures': Languages,
  'luxury-hospitality': Gem,
  'fashion': Shirt,
  'aeronautics': Plane,
  'sport-management': Trophy,
};

const categoryStyles = [
  "text-chart-1 bg-chart-1/10 hover:bg-chart-1/20 border border-chart-1/20",
  "text-chart-2 bg-chart-2/10 hover:bg-chart-2/20 border border-chart-2/20",
  "text-chart-3 bg-chart-3/10 hover:bg-chart-3/20 border border-chart-3/20",
  "text-chart-4 bg-chart-4/10 hover:bg-chart-4/20 border border-chart-4/20",
  "text-chart-5 bg-chart-5/10 hover:bg-chart-5/20 border border-chart-5/20",
  "text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20",
];

export default function CourseCategoryNav() {
  const { t } = useTranslation();

  const categoriesPart1 = courseCategories.slice(0, 3);
  const categoriesPart2 = courseCategories.slice(3, 6);

  return (
    <nav className="sticky top-28 z-40 bg-secondary/95 backdrop-blur-sm border-y shadow-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center py-4 gap-3">
          <div className="flex flex-wrap justify-center gap-3">
            {categoriesPart1.map((category, index) => {
              const Icon = categoryIcons[category.id];
              return (
                <Link 
                  key={category.id} 
                  href={`#${category.id}`}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out font-semibold",
                    categoryStyles[index],
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap text-sm">{t(category.titleKey)}</span>
                </Link>
              );
            })}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categoriesPart2.map((category, index) => {
              const Icon = categoryIcons[category.id];
              const styleIndex = index + 3;
              return (
                <Link 
                  key={category.id} 
                  href={`#${category.id}`}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out font-semibold",
                    categoryStyles[styleIndex],
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap text-sm">{t(category.titleKey)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
