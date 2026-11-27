"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Target, BarChart3, Globe } from "lucide-react";
import { Image3D } from "./image-3d";
import Link from "next/link";
import { fireTrackingPixel } from "@/lib/tracking";

export function FeaturesTopSection() {
  const t = useTranslations("keyFeatures");

  const icons = [Target, Globe, BarChart3, Zap];

  return (
    <section id="more-features" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Feature Section */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16">
          {/* Left Image */}
          <div className="order-2 lg:order-1">
            <Image3D
              lightSrc="/favicon.svg" // Placeholder, should be a real preview
              darkSrc="/favicon.svg"  // Placeholder, should be a real preview
              alt="AI Search Visibility"
              direction="left"
            />
          </div>
          
          {/* Right Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                Ready to dominate the AI search landscape?
              </h3>
              <p className="text-muted-foreground text-base text-pretty">
                GeoRank provides the most advanced tools to track and optimize your brand&apos;s presence across all major AI platforms.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3].map((index) => {
                const Icon = icons[index];
                return (
                  <li key={index} className="group hover:bg-accent/5 flex items-start gap-3 p-2 rounded-lg transition-colors">
                    <div className="mt-0.5 flex shrink-0 items-center justify-center">
                      <Icon className="size-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-medium">{t(`items.${index}.title`)}</h3>
                      <p className="text-muted-foreground mt-1 text-sm">{t(`items.${index}.description`)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pe-4 pt-2">
              <Button size="lg" className="rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer" asChild>
                <Link href="/signup" className='flex items-center' onClick={() => fireTrackingPixel("signup")} data-umami-event="CTA Click" data-umami-event-location="Key Features" data-umami-event-label="Get Started">
                  Get Started
                  <ArrowRight className="ms-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl transition-all hover:bg-muted/50 active:scale-95 cursor-pointer" asChild>
                <Link href="/contact" onClick={() => fireTrackingPixel("contact")} data-umami-event="CTA Click" data-umami-event-location="Key Features" data-umami-event-label="Learn More">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
