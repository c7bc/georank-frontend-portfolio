"use client";

import { useTranslations } from "next-intl";
import { AiPlatformsVisual } from "./features/ai-platforms-visual";
import { CompetitorBarsVisual } from "./features/competitor-bars-visual";
import { RecommendationsVisual } from "./features/recommendations-visual";
import { ScoreGaugeVisual } from "./features/score-gauge-visual";

export function FeaturesSection() {
  const t = useTranslations("features");

  return (
    <section id="metafi-features" className="bg-background px-6 lg:px-0">
      <div className="container max-w-[1200px] mx-auto px-0 py-16 sm:py-20 md:px-6 md:py-28">
        {/* Tagline */}
        <p className="text-primary mb-4 text-center text-sm sm:text-base font-medium">
          Features
        </p>

        {/* Main Heading */}
        <h2 className="text-foreground mx-auto max-w-3xl text-center text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl md:text-5xl">
          {t("title")}
        </h2>

        {/* Subtitle */}
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center text-base sm:text-lg">
          {t("subtitle")}
        </p>

        {/* First Row of Features */}
        <div className="mt-12 flex flex-col gap-6 md:mt-14 md:gap-8 lg:flex-row lg:items-stretch">
          {/* Feature 1 - Larger */}
          <div className="lg:flex-1">
            <div className="bg-card border-border relative flex h-full flex-col rounded-[16px] border p-6 text-left shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)]">
              <div className="flex-shrink-0">
                <h3 className="text-foreground text-lg font-medium sm:text-xl">
                  {t("items.0.title")}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base min-h-[72px]">
                  {t("items.0.description")}
                </p>
              </div>
              <div className="relative mt-6 w-full overflow-hidden rounded-[12px]">
                <div className="bg-sidebar relative h-[220px] w-full sm:h-[260px] md:h-[300px]">
                  <AiPlatformsVisual />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - Smaller */}
          <div className="lg:flex-1">
            <div className="bg-card border-border relative flex h-full flex-col rounded-[16px] border p-6 text-left shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)]">
              <div className="flex-shrink-0">
                <h3 className="text-foreground text-lg font-medium sm:text-xl">
                  {t("items.1.title")}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base min-h-[72px]">
                  {t("items.1.description")}
                </p>
              </div>
              <div className="relative mt-6 w-full overflow-hidden rounded-[12px]">
                <div className="bg-sidebar relative h-[220px] w-full sm:h-[260px] md:h-[300px]">
                  <CompetitorBarsVisual />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row of Features */}
        <div className="mt-6 flex flex-col gap-6 md:mt-8 md:gap-8 lg:flex-row">
          {/* Feature 3 - Smaller */}
          <div className="lg:w-[500px]">
            <div className="bg-card border-border relative flex flex-col rounded-[16px] border p-6 text-left shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)]">
              <h3 className="text-foreground text-lg font-medium sm:text-xl">
                {t("items.2.title")}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                {t("items.2.description")}
              </p>
              <div className="relative mt-6 w-full overflow-hidden rounded-[12px]">
                <div className="bg-sidebar relative h-[220px] w-full sm:h-[260px] md:h-[300px]">
                  <RecommendationsVisual />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4 - Larger */}
          <div className="lg:flex-1">
            <div className="bg-card border-border relative flex flex-col rounded-[16px] border p-6 text-left shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)]">
              <h3 className="text-foreground text-lg font-medium sm:text-xl">
                {t("items.3.title")}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                {t("items.3.description")}
              </p>
              <div className="relative mt-6 w-full overflow-hidden rounded-[12px]">
                <div className="bg-sidebar relative h-[220px] w-full sm:h-[260px] md:h-[300px]">
                  <ScoreGaugeVisual />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
