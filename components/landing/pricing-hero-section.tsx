"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { fireTrackingPixel } from "@/lib/tracking";

export function PricingHeroSection() {
  const t = useTranslations("pricingHero");
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: t("free.name"),
      price: "0",
      yearlyPrice: "0",
      description: t("free.description"),
      features: t.raw("free.features"),
      cta: t("free.cta"),
      ctaLink: "/signup",
      highlighted: false,
      badge: null,
      isFree: true,
    },
    {
      name: t("firstMovers.name"),
      price: "5",
      yearlyPrice: "4",
      description: t("firstMovers.description"),
      features: t.raw("firstMovers.features"),
      cta: t("firstMovers.cta"),
      ctaLink: "/signup",
      highlighted: false,
      badge: t("firstMovers.badge"),
    },
    {
      name: t("starter.name"),
      price: "49",
      yearlyPrice: "39",
      description: t("starter.description"),
      features: t.raw("starter.features"),
      cta: t("starter.cta"),
      ctaLink: "/signup",
      highlighted: false,
      badge: null,
    },
    {
      name: t("pro.name"),
      price: "99",
      yearlyPrice: "79",
      description: t("pro.description"),
      features: t.raw("pro.features"),
      cta: t("pro.cta"),
      ctaLink: "/signup",
      highlighted: true,
      badge: t("pro.badge"),
    },
    {
      name: t("agency.name"),
      price: "249",
      yearlyPrice: "199",
      description: t("agency.description"),
      features: t.raw("agency.features"),
      cta: t("agency.cta"),
      ctaLink: "/signup",
      highlighted: false,
      badge: null,
    },
    {
      name: t("enterprise.name"),
      price: t("enterprise.price"),
      yearlyPrice: t("enterprise.price"),
      description: t("enterprise.description"),
      features: t.raw("enterprise.features"),
      cta: t("enterprise.cta"),
      ctaLink: "/contact",
      highlighted: false,
      badge: null,
      isCustom: true,
    },
  ];

  return (
    <section id="metafi-pricing-hero" className="bg-background">
      <div className="relative overflow-hidden">
        {/* Header */}
        <div className="mx-auto max-w-4xl px-6 py-12 text-center sm:px-8 sm:py-16 md:py-20">
            <p className="text-primary text-sm sm:text-base">{t("tagline")}</p>
            <h1 className="text-foreground mt-4 text-4xl leading-tight font-medium tracking-tight text-balance sm:text-5xl md:text-[68px]">
              {t("title")}
              <br className="hidden sm:block" />
              {t("titleLine2")}
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base sm:text-lg">
              {t("subtitle")}
            </p>

            {/* Toggle */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="text-muted-foreground text-sm sm:text-base">
                {t("monthly")}
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                aria-label="Toggle yearly billing"
              />
              <span className="text-sm sm:text-base text-foreground">
                {t("yearly")}
              </span>
            </div>
            <div className="text-green-600 dark:text-green-500 mt-4 text-sm font-medium">
              {t("saveOff")}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="mx-auto max-w-7xl gap-6 px-6 pb-12 sm:px-8 md:pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, idx) => (
              <article
                key={idx}
                className={`shadow-sm rounded-[20px] border flex ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground border-transparent"
                    : "bg-card border-border"
                }`}
              >
                <div className="flex flex-col flex-1 gap-6 p-5 sm:p-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-lg font-semibold ${
                          plan.highlighted ? "text-primary-foreground" : "text-foreground"
                        }`}
                      >
                        {plan.name}
                      </h3>
                      {plan.badge && (
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs ${
                            plan.highlighted
                              ? "bg-primary-foreground/95 text-primary"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          🔥 {plan.badge}
                        </span>
                      )}
                    </div>
                    <p
                      className={`mt-2 text-sm ${
                        plan.highlighted ? "text-primary-foreground/85" : "text-muted-foreground"
                      }`}
                    >
                      {plan.description}
                    </p>
                    <div
                      className={`mt-6 text-[40px] leading-none font-semibold ${
                        plan.highlighted ? "text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {plan.isCustom ? (
                        plan.price
                      ) : (
                        `$${isYearly ? plan.yearlyPrice : plan.price}`
                      )}
                    </div>
                    <div
                      className={`mt-2 text-sm ${
                        plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {plan.isCustom ? t("contactUs") : plan.isFree ? "" : t("perMonth")}
                    </div>
                  </div>

                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature: string, featureIdx: number) => (
                      <li key={featureIdx} className="flex items-start gap-3">
                        <Check
                          className={`mt-0.5 size-4 shrink-0 ${
                            plan.highlighted ? "text-primary-foreground" : "text-primary"
                          }`}
                          strokeWidth={2.5}
                        />
                        <span
                          className={`text-sm ${
                            plan.highlighted ? "text-primary-foreground/95" : "text-muted-foreground"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div>
                    <Button
                      asChild
                      className={`w-full px-6 py-[14px] h-12 rounded-[12px] ${
                        plan.highlighted
                          ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      <Link href={plan.ctaLink} onClick={() => fireTrackingPixel(plan.ctaLink === "/contact" ? "contact" : "signup")} data-umami-event="CTA Click" data-umami-event-location="Pricing Hero" data-umami-event-label={`${plan.name} Plan`}>{plan.cta}</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>
      <div className="h-6 sm:h-8"></div>
    </section>
  );
}
