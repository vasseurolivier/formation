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
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from 'firebase/firestore';
import type { MediaAsset } from "@/lib/firebase-types";

const LOGO_DOC_ID = 'siteLogo';

export default function Header() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const firestore = useFirestore();

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
    { href: "/testimonials", label: t("nav.testimonials") },
    { href: "/contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-foreground/90 backdrop-blur-lg border-b border-white/20" : "bg-transparent"
      )}
    >
      <div className="flex h-40 w-full items-center px-4 md:px-6">
        <Link href="/" className="flex-shrink-0">
          {logoUrl ? (
            <div className="relative h-32 w-[32rem]">
              <Image 
                src={logoUrl} 
                alt="Site Logo"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <BookOpenText className="h-6 w-6 text-white" />
          )}
        </Link>
        <nav className="ml-10 hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium text-white/80 transition-colors hover:text-white",
                pathname === item.href && "text-white font-semibold"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4 text-white">
          <LanguageSwitcher />
           <Button asChild variant="outline" size="sm" className="text-white border-white/50 hover:bg-white/10">
            <Link href="/admin">Admin</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
