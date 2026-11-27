"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, Target, Trophy } from "lucide-react";

export function LpValueProps() {
  const t = useTranslations("lp-ai-visibility.bullets");

  const items = [
    {
      key: "item1",
      icon: BarChart3,
    },
    {
      key: "item2",
      icon: Trophy,
    },
    {
      key: "item3",
      icon: Target,
    },
  ];

  return (
    <section className="bg-background py-16 md:py-24 border-b border-border">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 justify-between gap-16 lg:grid-cols-2">
          {/* Left Column: Text Content */}
          <div className="flex h-full flex-col justify-center gap-8">
            <div className="space-y-4">
              <h2 className="leading-normal font-medium text-muted-foreground">
                GeoRank Features
              </h2>
              <p className="text-xl font-medium sm:text-2xl xl:text-3xl text-balance text-foreground">
                <strong className="text-primary">Everything you need to rank in AI. </strong>
                Monitor your brand&apos;s visibility, benchmark against competitors, and get actionable recommendations to dominate AI search results.
              </p>
            </div>
            <div>
              <Button asChild size="lg" className="rounded-md font-medium px-8">
                <Link href="/signup">
                  Start Monitoring Now
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Feature Cards */}
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="group/card flex flex-col border-none bg-muted/40 p-5 shadow-none rounded-xl ring-1 ring-foreground/5 hover:bg-muted/60 transition-colors">
                    <div className="space-y-4 p-0">
                      <div className="p-2 w-fit rounded-lg bg-background ring-1 ring-foreground/10">
                         <Icon className="size-6 text-primary" />
                      </div>
                      <div className="max-w-110 space-y-1">
                        <div className="text-lg font-medium xl:text-xl text-foreground">
                          {t(`${item.key}.title`)}
                        </div>
                        <div className="text-muted-foreground text-sm text-balance xl:text-base">
                          {t(`${item.key}.description`)}
                        </div>
                      </div>
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
