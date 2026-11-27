"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { fireTrackingPixel } from "@/lib/tracking";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function PricingSection() {
  const t = useTranslations("pricing");
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    { key: "free", highlighted: false },
    { key: "first_movers", highlighted: false },
    { key: "starter", highlighted: false },
    { key: "pro", highlighted: true },
    { key: "agency", highlighted: false },
    { key: "enterprise", highlighted: false },
  ] as const;

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
            <Badge variant="outline" className="mb-4">{t("tagline")}</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                {t("title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
                {t("subtitle")}
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-2">
                <ToggleGroup
                type="single"
                value={isYearly ? "yearly" : "monthly"}
                onValueChange={(value) => setIsYearly(value === "yearly")}
                className="bg-secondary text-secondary-foreground border-none rounded-full p-1 cursor-pointer shadow-none"
                >
                <ToggleGroupItem
                    value="monthly"
                    className="data-[state=on]:bg-background data-[state=on]:border-border border-transparent border px-6 !rounded-full data-[state=on]:text-foreground hover:bg-transparent cursor-pointer transition-colors"
                >
                    {t("monthly")}
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="yearly"
                    className="data-[state=on]:bg-background data-[state=on]:border-border border-transparent border px-6 !rounded-full data-[state=on]:text-foreground hover:bg-transparent cursor-pointer transition-colors"
                >
                    {t("yearly")}
                </ToggleGroupItem>
                </ToggleGroup>
            </div>

            <p className="text-sm text-muted-foreground">
                <span className="text-primary font-semibold">{t("yearlySave")}</span> {t("saveOff") || "On Annual Billing"}
            </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan, index) => {
                const planData = t.raw(`plans.${plan.key}`) as {
                  name: string;
                  price: string;
                  yearlyPrice: string;
                  description: string;
                  features: string[];
                };
                const price = plan.key === "enterprise"
                  ? null
                  : isYearly
                  ? planData.yearlyPrice
                  : planData.price;

                return (
                  <div
                    key={plan.key}
                    className={`p-8 flex flex-col gap-6 transition-all duration-300 border-b md:border-r border-border/50 ${
                      plan.key === "pro"
                        ? "bg-foreground text-background shadow-2xl relative z-10"
                        : "hover:bg-muted/10"
                    }`}
                  >
                    {/* Plan Header */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-lg font-bold tracking-tight">{planData.name}</div>
                        {plan.key === "first_movers" && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
                                🔥 {t("limitedPlan")}
                            </Badge>
                        )}
                        {plan.key === "pro" && (
                            <Badge className="bg-primary text-primary-foreground">
                                🔥 {t("mostPopular")}
                            </Badge>
                        )}
                      </div>
                      <div className={plan.key === "pro" ? "text-background/70 text-sm leading-relaxed min-h-[40px]" : "text-muted-foreground text-sm leading-relaxed min-h-[40px]"}>{planData.description}</div>
                    </div>

                    {/* Pricing */}
                    <div>
                      <div className="text-4xl font-bold mb-1 flex items-baseline gap-1">
                        {price ? (
                          <>
                            <span className="text-3xl font-medium">$</span>
                            <span>{price}</span>
                          </>
                        ) : (
                          <span>{t("custom")}</span>
                        )}
                        {price && <span className="text-sm font-normal text-muted-foreground ml-1">{t("perMonth")}</span>}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div>
                      <Button
                        asChild
                        className={`w-full h-11 rounded-[8px] font-semibold cursor-pointer transition-all ${
                          plan.key === "pro"
                            ? 'bg-background text-foreground hover:bg-background/90 shadow-md ring-1 ring-white/20'
                            : 'bg-background hover:bg-muted/50 border border-border shadow-sm'
                        }`}
                        variant={plan.key === "pro" ? 'default' : 'outline'}
                      >
                        <Link href={plan.key === "enterprise" ? "/contact" : "/signup"} onClick={() => fireTrackingPixel(plan.key === "enterprise" ? "contact" : "signup")} data-umami-event="CTA Click" data-umami-event-location="Pricing" data-umami-event-label={`${planData.name} Plan`}>
                          {plan.key === "enterprise"
                            ? t("contactSales")
                            : plan.key === "free"
                            ? t("getStarted")
                            : t("startTrial")}
                        </Link>
                      </Button>
                    </div>

                    {/* Features block */}
                    <div className="flex-1">
                      <ul role="list" className="space-y-3 text-sm">
                        {planData.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className={`flex items-start gap-3 transition-colors ${plan.key === "pro" ? "text-background/80" : "text-muted-foreground group-hover:text-foreground"}`}>
                            <Check className={`size-4 flex-shrink-0 mt-0.5 ${plan.key === "pro" ? "text-background" : "text-primary"}`} strokeWidth={3} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
