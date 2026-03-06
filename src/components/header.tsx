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

const LOGO_DOC_ID = 'siteLogo';

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const firestore = useFirestore();

  const [headerClass, setHeaderClass] = useState("fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setHeaderClass("fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-foreground/90 backdrop-blur-lg border-b border-white/20");
      } else {
        setHeaderClass("fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      <div className="w-full mx-auto flex h-28 items-center justify-start px-4 md:px-6">
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
                    />
                ) : (
                  <div className="h-full w-full bg-white/10 animate-pulse rounded-md"></div>
                )}
              </div>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
                <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "text-xl font-medium text-white/80 transition-colors hover:text-white [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.5))]",
                    pathname === item.href && "text-white font-semibold"
                )}
                >
                {item.label}
                </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 text-white ml-auto">
          <LanguageSwitcher />
           <Button asChild variant="outline" size="sm" className="text-white border-white/50 hover:bg-white/10">
            <Link href="/admin">Admin</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
