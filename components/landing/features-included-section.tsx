"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export function FeaturesIncludedSection() {
  const t = useTranslations("featuresIncluded");

  return (
    <section id="metafi-features-included" className="bg-background py-16 sm:py-20 md:py-24">
        {/* Header */}
        <div className="text-center">
          <p className="text-primary text-sm sm:text-base">{t("tagline")}</p>
          <h2 className="text-foreground mt-4 text-3xl leading-tight font-medium tracking-tight sm:text-5xl">
            {t("title")}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-sm sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        {/* Features Grid */}
        <ul className="mx-auto max-w-7xl mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 md:mt-18 md:gap-x-12 md:gap-y-18 lg:grid-cols-3">
          {t.raw("items").map((item: { icon: string; title: string; description: string }, idx: number) => (
            <li key={idx} className="text-center">
              <div
                className="border-border bg-card shadow-sm mx-auto mb-4 flex h-[44px] w-[44px] items-center justify-center rounded-[12px] border"
                aria-hidden="true"
              >
                <Image
                  alt=""
                  loading="lazy"
                  width={24}
                  height={24}
                  decoding="async"
                  className="h-6 w-6 dark:invert"
                  src={item.icon}
                />
              </div>
              <h3 className="text-foreground mt-6 text-lg font-medium">
                {item.title}
              </h3>
              <p className="text-muted-foreground mx-auto mt-2 max-w-[44ch] text-base">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
    </section>
  );
}
