"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { fireTrackingPixel } from "@/lib/tracking";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const mobileToggle = React.useRef<HTMLButtonElement>(null);
  const mobileMenuId = React.useId();

  return (
    <header
      className="bg-background border-border relative z-50 h-20 border-b px-2.5 lg:px-0"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isMenuOpen) {
          setIsMenuOpen(false);
          mobileToggle.current?.focus();
        }
      }}
    >
      <div className="max-w-[1200px] mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-[auto_1fr_auto]">
        <div className="flex items-center">
          <Logo href="/" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center justify-center gap-8 lg:flex">
          <Link href="/features" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
            {t("features")}
          </Link>
          <Link href="/integrations" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
            {t("integrations")}
          </Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
            {t("pricing")}
          </Link>

          <Link 
            href="https://docs.georank.site" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            {t("docs")}
          </Link>

          <Link href="/contact" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
            {t("contact")}
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2.5">
          <Button asChild variant="outline" size="sm" className="hidden h-9 rounded-lg px-3 text-xs font-semibold sm:inline-flex">
            <Link href="/login">{t("login")}</Link>
          </Button>
          <Button asChild size="sm" className="hidden h-9 rounded-lg px-3 text-xs font-semibold sm:inline-flex">
            <Link href="/signup" onClick={() => fireTrackingPixel("signup")} data-umami-event="CTA Click" data-umami-event-location="Header" data-umami-event-label="Start Free">
              {t("startFree")}
            </Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-8 lg:hidden cursor-pointer"
            ref={mobileToggle}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls={mobileMenuId}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="sr-only">Toggle main menu</span>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        id={mobileMenuId}
        inert={!isMenuOpen}
        className={cn(
          "lg:hidden border-border bg-background absolute top-20 left-0 w-full transition-all duration-300 ease-in-out border-t",
          isMenuOpen ? "h-[calc(100vh-80px)] opacity-100 visible" : "h-0 opacity-0 invisible"
        )}
      >
        <div className="container mx-auto px-5 py-6 space-y-6">
           <nav className="flex flex-col gap-6">
              <Link href="/features" className="text-lg tracking-tight text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>
                {t("features")}
              </Link>
              <Link href="/integrations" className="text-lg tracking-tight text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>
                {t("integrations")}
              </Link>
              <Link href="/pricing" className="text-lg tracking-tight text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>
                {t("pricing")}
              </Link>
              <Link 
                href="https://docs.georank.site" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg tracking-tight text-muted-foreground hover:text-foreground" 
                onClick={() => setIsMenuOpen(false)}
              >
                {t("docs")}
              </Link>
              <Link href="/contact" className="text-lg tracking-tight text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>
                {t("contact")}
              </Link>
           </nav>

           <div className="flex flex-col gap-3">
              <Button asChild variant="outline" className="h-9 w-full rounded-lg text-xs font-semibold">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>{t("login")}</Link>
              </Button>
              <Button asChild className="h-9 w-full rounded-lg text-xs font-semibold">
                <Link href="/signup" onClick={() => { setIsMenuOpen(false); fireTrackingPixel("signup"); }} data-umami-event="CTA Click" data-umami-event-location="Header Mobile" data-umami-event-label="Start Free">
                  {t("startFree")}
                </Link>
              </Button>
           </div>
        </div>
      </div>
    </header>
  );
}
