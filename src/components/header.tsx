"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpenText } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import LanguageSwitcher from "@/components/language-switcher";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { href: "#home", label: t("nav.home") },
    { href: "#courses", label: t("nav.courses") },
    { href: "#about", label: t("nav.about") },
    { href: "#testimonials", label: t("nav.testimonials") },
    { href: "#contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
        window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 80, // 80px offset for header height
            behavior: 'smooth'
        });
    }
  };


  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border/50" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="#home" className="flex items-center gap-2" onClick={(e) => handleScrollTo(e, '#home')}>
          <BookOpenText className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg font-bold text-foreground">
            {t("appName")}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleScrollTo(e, item.href)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
           <Link href="/admin/course-generator" legacyBehavior>
            <Button variant="outline" size="sm">Admin</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
