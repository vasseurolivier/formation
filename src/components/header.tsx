"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookOpenText } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import LanguageSwitcher from "@/components/language-switcher";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/courses", label: t("nav.courses") },
    { href: "/about", label: t("nav.about") },
    { href: "/testimonials", label: t("nav.testimonials") },
    { href: "/contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Load logo from local storage
    const storedLogo = localStorage.getItem('siteLogo');
    if (storedLogo) {
      setLogoUrl(storedLogo);
    }

    // Listen for storage changes to update logo in real-time
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'siteLogo') {
        setLogoUrl(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border/50" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <div className="relative h-8 w-32">
              <Image 
                src={logoUrl} 
                alt="Site Logo"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <>
              <BookOpenText className="h-6 w-6 text-primary" />
              <span className="font-headline text-lg font-bold text-foreground">
                {t("appName")}
              </span>
            </>
          )}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
           <Button asChild variant="outline" size="sm">
            <Link href="/admin">Admin</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
