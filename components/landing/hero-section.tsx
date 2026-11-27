"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { fireTrackingPixel } from "@/lib/tracking";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section
      id="metafi-hero"
      className="bg-background border-b-border relative overflow-hidden border-b px-6 lg:px-0 flex flex-col"
      style={{ minHeight: 'calc(100vh - 8rem)' }}
    >
      {/* Background Pattern and Gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 bottom-0 h-[450px] md:h-[600px]">
          {/* Background Gradient using theme colors */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(ellipse at center bottom, var(--primary), transparent 60%)'
            }}
          />

          {/* Grid Pattern Background */}
          <div
            className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--grid-border,rgba(0,0,0,0.05))_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-border,rgba(0,0,0,0.05))_1px,transparent_1px)] transition-colors duration-500 [background-size:calc(var(--square-size,64px))_calc(var(--square-size,64px))]"
            style={{
              "--grid-border": "var(--border)",
            } as React.CSSProperties}
          >
            {/* Radial Mask Effect */}
            <div className="pointer-events-none absolute inset-0 bg-[var(--background)] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          </div>

          {/* Top Gradient Fade */}
          <div className="from-background to-background/0 absolute inset-x-0 top-0 h-40 bg-gradient-to-b" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative container mx-auto px-0 md:px-6 flex flex-col flex-1 items-center">
        {/* Hero Content */}
        <div className="mx-auto grid max-w-4xl gap-6 py-14 text-center sm:py-16 md:gap-8 md:pt-24 md:pb-20">
          {/* Headline */}
          <h1 className="text-foreground text-4xl leading-tight font-medium tracking-tight text-balance sm:text-5xl md:text-[68px]">
            {t("title")} {t("titleHighlight")}
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground md:text-md mx-auto max-w-2xl text-base sm:text-lg">
            {t("subtitle")}
          </p>

          {/* CTA Buttons with subtle glow */}
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            <Button
              asChild
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 h-12 px-6 py-[14px] w-full sm:w-auto"
            >
              <Link href="/signup" onClick={() => fireTrackingPixel("signup")} data-umami-event="CTA Click" data-umami-event-location="Hero" data-umami-event-label="Get Started">
                {t("ctaPrimary")}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-background text-foreground border border-border shadow-xs hover:bg-muted h-12 px-6 py-[14px] w-full sm:w-auto"
            >
              <Link href="/contact" onClick={() => fireTrackingPixel("contact")} data-umami-event="CTA Click" data-umami-event-location="Hero" data-umami-event-label="Contact Us">
                {t("ctaSecondary")}
              </Link>
            </Button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <figure aria-labelledby="dashboard-preview-caption" className="mx-auto mt-auto w-full max-w-[994px]">
          <figcaption id="dashboard-preview-caption" className="mb-2 text-center text-xs text-muted-foreground">
            {t("dashboardPreviewCaption")}
          </figcaption>
          <div
            aria-hidden="true"
            inert
            className="max-h-[340px] overflow-hidden rounded-t-[16px] bg-card/20 shadow-[0_15px_80px_-1px_rgba(8,9,10,0.04)] backdrop-blur-[20px] [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
          >
            <DashboardPreview />
          </div>
        </figure>
      </div>
    </section>
  );
}
