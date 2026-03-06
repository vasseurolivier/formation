
"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/50 bg-card">
      <div className="container mx-auto flex h-auto min-h-20 flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4 md:px-6">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          {t("footer.copyright").replace("{year}", currentYear.toString())}
        </p>
        <div className="flex gap-4 sm:gap-6 text-sm text-muted-foreground">
          <Link href="/privacy-policy" className="hover:text-foreground transition-colors">{t("nav.privacy")}</Link>
          <Link href="/terms-of-use" className="hover:text-foreground transition-colors">{t("nav.terms")}</Link>
        </div>
      </div>
    </footer>
  );
}
