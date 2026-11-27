"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
// import Image from "next/image"; // Removed as we are using components now
import { useState } from "react";
import { BarChart3, Bell, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fireTrackingPixel } from "@/lib/tracking";
import { cn } from "@/lib/utils";
import { VisibilityTrackingVisual } from "@/components/landing/features/visibility-tracking-visual";
import { ToolkitVisual } from "@/components/landing/features/toolkit-visual";
import { AgencyVisual } from "@/components/landing/features/agency-visual";

export function FeaturesAndPricing() {
  const t = useTranslations("featuresAndPricing");
  const [activeTab, setActiveTab] = useState("tracker");

  const benefits = [
    {
      icon: BarChart3,
      title: t("benefits.item1.title"),
      description: t("benefits.item1.description"),
    },
    {
      icon: Bell,
      title: t("benefits.item2.title"),
      description: t("benefits.item2.description"),
    },
    {
      icon: Server,
      title: t("benefits.item3.title"),
      description: t("benefits.item3.description"),
    },
  ];

  const tabs = [
    {
      id: "tracker",
      label: t("tabs.items.tracker.title"),
      content: t("tabs.items.tracker.description"),
    },
    {
      id: "competitors",
      label: t("tabs.items.competitors.title"),
      content: t("tabs.items.competitors.description"),
    },
    {
      id: "recommendations",
      label: t("tabs.items.recommendations.title"),
      content: t("tabs.items.recommendations.description"),
    },
    {
      id: "reporting",
      label: t("tabs.items.reporting.title"),
      content: t("tabs.items.reporting.description"),
    },
  ];

  return (
    <>
      {/* Features Hero Section */}
      <section id="features" className="bg-background px-6 lg:px-0">
        <div className="container max-w-[1200px] mx-auto px-0 md:px-6 py-12">
          <div className="bg-card/30 relative overflow-hidden rounded-[24px]">
            <div className="absolute inset-0 rounded-[24px] border border-border/60 pointer-events-none [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.1),black_30%)]" />
            <div className="grid items-center gap-8 p-6 sm:p-8 md:gap-12 md:p-12 lg:grid-cols-2">
              <div className="max-w-xl">
                <p className="text-primary mb-2 text-sm sm:text-base font-semibold">
                  {t("hero.tagline")}
                </p>
                <h2 className="text-foreground text-[36px] leading-[1.05] font-medium tracking-tight sm:text-5xl md:text-[64px]">
                  {t("hero.title")}
                </h2>
                <p className="text-muted-foreground mt-4 text-base sm:text-lg">
                  {t("hero.description")}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-start sm:gap-4">
                  <Button asChild size="lg" className="h-12 px-6 rounded-xl">
                    <Link href="/pricing" onClick={() => fireTrackingPixel("pricing")} data-umami-event="CTA Click" data-umami-event-location="Features" data-umami-event-label="Get Started">{t("hero.getStarted")}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 px-6 rounded-xl">
                    <Link href="/contact" onClick={() => fireTrackingPixel("contact")} data-umami-event="CTA Click" data-umami-event-location="Features" data-umami-event-label="Contact Sales">{t("hero.contactSales")}</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden sm:flex relative justify-center h-[400px] lg:h-[500px] w-full items-center">
                <div className="w-full h-full">
                  <VisibilityTrackingVisual />
                </div>
              </div>
            </div>
          </div>
          <div className="h-6 sm:h-8"></div>
        </div>
      </section>

      {/* Feature Benefits Section */}
      <section id="feature-benefits" className="bg-background px-6 lg:px-0">
        <div className="container max-w-[1200px] mx-auto px-0 py-12 sm:py-16 md:px-6 md:py-20">
          <ul className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-3">
            {benefits.map((item, index) => (
              <li key={index} className="text-start">
                <div className="border-border shadow-sm mb-6 flex h-[44px] w-[44px] items-center justify-center rounded-[12px] border bg-card text-foreground">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-foreground text-base font-medium sm:text-lg">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mx-auto mt-2 text-sm sm:text-base">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features Tabs Section */}
      <section id="integrations" className="bg-background px-6 lg:px-0">
        <div className="container max-w-[1200px] mx-auto px-0 py-16 sm:py-20 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <p className="text-primary text-sm sm:text-base font-semibold">
              {t("tabs.tagline")}
            </p>
            <h2 className="text-foreground mt-4 text-3xl leading-tight font-medium tracking-tight sm:text-5xl lg:text-[52px]">
              {t("tabs.title")}
            </h2>
            <p className="text-muted-foreground mt-4 text-base sm:text-lg">
              {t("tabs.description")}
            </p>
          </div>
          <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[minmax(0,500px)_minmax(0,1fr)] lg:gap-16">
            <div className="w-full min-w-0 order-last lg:order-first">
              <div className="relative w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden">
                <ToolkitVisual />
              </div>
            </div>
            <div className="min-w-0">
              <div role="tablist" aria-orientation="vertical" className="flex flex-col">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full border-b py-5 text-left transition-colors outline-none",
                      activeTab === tab.id
                        ? "border-primary/70"
                        : "border-border hover:text-foreground/80"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "text-base font-medium",
                          activeTab === tab.id ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {tab.label}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        activeTab === tab.id ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="text-muted-foreground text-sm sm:text-base">
                          {tab.content}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Feature Section */}
      <section id="feature-pricing" className="bg-background px-6 lg:px-0">
        <div className="container max-w-[1200px] mx-auto px-0 py-16 sm:py-20 md:px-6 md:py-24">
          <div className="grid items-center gap-10 md:gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,700px)]">
            <div className="max-w-xl">
              <p className="text-primary mb-4 text-sm sm:text-base font-semibold">
                {t("pricingFeature.tagline")}
              </p>
              <h2 className="text-foreground text-3xl leading-tight font-medium tracking-tight sm:text-5xl md:text-[56px]">
                {t("pricingFeature.title")}
              </h2>
              <p className="text-muted-foreground mt-4 text-base sm:text-lg">
                {t("pricingFeature.description1")}
              </p>

            </div>
            <div className="w-full relative h-[400px] sm:h-[500px]">
              <AgencyVisual />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
