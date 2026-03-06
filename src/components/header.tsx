"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import LanguageSwitcher from "@/components/language-switcher";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from 'firebase/firestore';
import type { MediaAsset } from "@/lib/firebase-types";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const LOGO_DOC_ID = 'siteLogo';

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const firestore = useFirestore();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Set initial state on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerClass = isScrolled
    ? "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-sm border-b border-border"
    : "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent";

  const logoDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'mediaAssets', LOGO_DOC_ID);
  }, [firestore]);

  const { data: logoData } = useDoc<MediaAsset>(logoDocRef);
  const logoUrl = logoData?.url;

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/courses", label: t("nav.courses") },
    { href: "/locations", label: t("nav.locations") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];


  return (
    <header className={headerClass}>
      <div className="w-full mx-auto flex h-28 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex-shrink-0">
              <div className="relative" style={{ height: '6.3rem', width: '5rem' }}>
                {logoUrl ? (
                    <Image
                        src={logoUrl}
                        alt="Site Logo"
                        fill
                        style={{ objectFit: 'contain', objectPosition: 'left' }}
                        priority
                        className={cn("transition-all duration-300", !isScrolled && "invert")}
                    />
                ) : (
                  <div className="h-full w-full bg-muted/20 animate-pulse rounded-md"></div>
                )}
              </div>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
                <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "text-xl font-medium transition-colors",
                    isScrolled 
                        ? "text-foreground/80 hover:text-foreground" 
                        : "text-white/80 hover:text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]",
                    (pathname === item.href) && (isScrolled ? "text-primary font-semibold" : "text-white font-semibold")
                )}
                >
                {item.label}
                </Link>
            ))}
          </nav>
        </div>

        <div className={cn(
          "flex items-center gap-2",
          isScrolled ? "text-foreground" : "text-white"
          )}>
          <LanguageSwitcher />
          <div className="md:hidden">
              <Sheet>
                  <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <Menu className="h-8 w-8" />
                          <span className="sr-only">Ouvrir le menu</span>
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] bg-background p-0">
                      <div className="p-6 h-full">
                        <nav className="flex flex-col gap-6 mt-8">
                            {navItems.map((item) => (
                                <SheetClose asChild key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "text-2xl font-medium",
                                            pathname === item.href ? "text-primary" : "text-foreground/80",
                                            "hover:text-primary transition-colors"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                </SheetClose>
                            ))}
                        </nav>
                      </div>
                  </SheetContent>
              </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
