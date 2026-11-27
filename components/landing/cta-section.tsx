"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { fireTrackingPixel } from "@/lib/tracking";

const platforms = [
  { name: "ChatGPT", icon: "/platforms/chatgpt.png" },
  { name: "Perplexity", icon: "/platforms/perplexity.png" },
  { name: "Claude", icon: "/platforms/claude.webp" },
  { name: "Gemini", icon: "/platforms/gemini.png" },
  { name: "Grok", icon: "/platforms/grok.png" },
  { name: "DeepSeek", icon: "/platforms/deepseek.png" },
];

export function CtaSection() {
  const t = useTranslations("cta");
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % platforms.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-background px-6 py-16 lg:py-24">
      <div className="container max-w-[1200px] mx-auto">
        <div className="relative overflow-hidden rounded-[20px] border border-primary-foreground/[0.12] bg-primary dark:bg-muted/40 px-5 py-[72px]">
          {/* Heading */}
          <p className="text-3xl font-medium text-center text-primary-foreground dark:text-foreground text-balance md:text-5xl">
            {t("title")}
          </p>

          {/* Rotating platform names with blur transition */}
          <div className="relative mt-4 h-[90px] sm:h-[60px] md:h-16">
            {platforms.map((platform, i) => (
              <div
                key={platform.name}
                aria-hidden={i !== current}
                className="absolute inset-0 flex flex-col-reverse items-center justify-center gap-2 select-none whitespace-nowrap will-change-[filter,opacity] transition-[filter,opacity] duration-700 ease-out sm:flex-row"
                style={{
                  filter: i === current ? "blur(0px)" : "blur(20px)",
                  opacity: i === current ? 1 : 0,
                }}
              >
                <Image
                  src={platform.icon}
                  alt=""
                  width={48}
                  height={48}
                  className="size-10 md:size-12 brightness-0 invert"
                />
                <span className="text-3xl font-medium text-primary-foreground dark:text-foreground md:text-5xl">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>

          {/* Subtitle */}
          <p className="mx-auto mt-6 mb-8 max-w-[562px] text-center text-lg text-primary-foreground/60 dark:text-muted-foreground text-balance">
            {t("subtitle")}
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/signup"
              data-umami-event="CTA Click"
              data-umami-event-location="CTA Section"
              data-umami-event-label="Get Started"
              onClick={() => fireTrackingPixel("signup")}
              className="rounded-lg bg-primary-foreground px-3 py-1.5 text-sm font-medium text-primary transition-all hover:opacity-80 dark:bg-primary dark:text-primary-foreground"
            >
              {t("button")}
            </Link>
            <Link
              href="/contact"
              data-umami-event="CTA Click"
              data-umami-event-location="CTA Section"
              data-umami-event-label="Contact Us"
              onClick={() => fireTrackingPixel("contact")}
              className="rounded-lg bg-primary-foreground/10 px-3 py-1.5 text-sm font-medium text-primary-foreground ring-1 ring-primary-foreground/10 transition-all hover:opacity-70 dark:text-foreground dark:ring-border dark:bg-secondary/50"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
