"use client";

import { useTranslation } from "@/hooks/use-translation";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/50 bg-card">
      <div className="container mx-auto flex h-20 items-center justify-center px-4 md:px-6">
        <p className="text-sm text-muted-foreground">
          {t("footer.copyright").replace("{year}", currentYear.toString())}
        </p>
      </div>
    </footer>
  );
}
