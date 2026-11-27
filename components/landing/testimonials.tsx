"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const avatars = [
  "https://i.pravatar.cc/72?img=32",
  "https://i.pravatar.cc/72?img=14",
  "https://i.pravatar.cc/72?img=59",
  "https://i.pravatar.cc/72?img=53",
  "https://i.pravatar.cc/72?img=12",
  "https://i.pravatar.cc/72?img=44",
  "https://i.pravatar.cc/72?img=5",
  "https://i.pravatar.cc/72?img=8",
  "https://i.pravatar.cc/72?img=23",
  "https://i.pravatar.cc/72?img=36",
  "https://i.pravatar.cc/72?img=47",
  "https://i.pravatar.cc/72?img=68",
];

export function Testimonials() {
  const t = useTranslations("testimonials");
  const [expanded, setExpanded] = useState(false);

  const visibleCount = expanded ? 12 : 6;

  return (
    <section id="metafi-testimonials" className="bg-accent dark:bg-muted/40 px-6 lg:px-0">
      <div className="container max-w-[1200px] mx-auto px-0 py-16 sm:py-20 md:px-6 md:py-28">
        <p className="text-primary mb-4 text-center text-sm leading-tight font-medium sm:text-base">
          {t("tagline")}
        </p>

        <h2 className="text-foreground mx-auto max-w-4xl text-center text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl md:text-5xl">
          {t("title")}
        </h2>

        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center text-base font-normal sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="relative mt-10 md:mt-14">
          {!expanded && (
            <div className="from-accent to-accent/0 dark:from-card dark:to-card/0 pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t" />
          )}

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {avatars.slice(0, visibleCount).map((avatar, i) => (
              <li
                key={i}
                className="bg-card flex flex-col justify-between rounded-[16px] p-6"
              >
                <p className="text-foreground text-base leading-relaxed font-normal md:text-base">
                  &ldquo;{t(`items.${i}.quote`)}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <img
                    alt={t(`items.${i}.author`)}
                    loading="lazy"
                    width={36}
                    height={36}
                    className="rounded-full"
                    src={avatar}
                  />
                  <div>
                    <div className="text-foreground mb-0.5 text-base leading-tight font-medium">
                      {t(`items.${i}.author`)}
                    </div>
                    <div className="text-muted-foreground text-sm font-normal">
                      {t(`items.${i}.role`)}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={`relative z-20 flex justify-center transition-all duration-300 ${expanded ? "mt-8" : "-mt-6"}`}>
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 h-12 px-6 py-[14px]"
          >
            {expanded ? t("ctaLess") : t("cta")}
          </button>
        </div>
      </div>
    </section>
  );
}
