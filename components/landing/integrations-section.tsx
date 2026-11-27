"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { MessageSquare, Webhook, Mail, BarChart3, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const integrations: {
  key: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  logo?: string;
}[] = [
  {
    key: "slack",
    icon: MessageSquare,
    color: "text-white",
    bg: "bg-[#4A154B]",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/500px-Slack_icon_2019.svg.png",
  },
  {
    key: "discord",
    icon: MessageSquare,
    color: "text-white",
    bg: "bg-[#5865F2]",
    logo: "https://pngimg.com/d/discord_PNG8.png",
  },
  {
    key: "zapier",
    icon: Zap,
    color: "text-white",
    bg: "bg-[#FF4A00]",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKO-Qo92EcDepDsm1eVJtZeIO-gYLYqvqVCQ&s",
  },
  {
    key: "webhooks",
    icon: Webhook,
    color: "text-white",
    bg: "bg-primary dark:bg-primary-foreground",
  },
  {
    key: "email",
    icon: Mail,
    color: "text-white",
    bg: "bg-blue-500",
    logo: "https://cdn.iconscout.com/icon/free/png-256/free-gmail-logo-icon-svg-download-png-2476484.png?f=webp",
  },
  {
    key: "google_analytics",
    icon: BarChart3,
    color: "text-white",
    bg: "bg-[#E37400]",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2JD4rqFRrEukP9ejsQl5jL-lhIXWxzGCVow&s",
  },
];

export function IntegrationsSection() {
  const t = useTranslations("integrationsSection");

  return (
    <section id="metafi-integrations" className="bg-background dark:bg-muted/40 px-6 lg:px-0">
      <div className="container max-w-[1200px] mx-auto px-0 py-16 text-center sm:py-20 md:px-6 md:py-28">
        <p className="text-primary mb-4 text-sm leading-tight font-medium sm:text-base">
          {t("tagline")}
        </p>

        <h2 className="text-foreground mx-auto max-w-3xl text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl md:text-5xl">
          {t("title")}
        </h2>

        <div className="mx-auto mt-8 max-w-xl rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-center justify-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
            </span>
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {t("comingSoonBadge")}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("comingSoonMessage")}
          </p>
        </div>

        <ul className="mt-10 grid gap-12 sm:grid-cols-2 sm:gap-6 md:mt-20 md:gap-8 lg:grid-cols-3 [@media(min-width:1024px)]:[&>li:nth-child(n+4)]:mt-8">
          {integrations.map((integration, i) => {
            const Icon = integration.icon;
            return (
              <li
                key={integration.key}
                className="bg-accent dark:bg-[#050505] relative rounded-[16px] p-6 pb-8 border border-transparent dark:border-border"
              >
                <div className="pointer-events-none absolute -top-8 left-1/2 flex -translate-x-1/2 items-center justify-center">
                  {integration.logo ? (
                    <div className="flex items-center justify-center rounded-full">
                      <img
                        alt={`${integration.key} integration logo`}
                        loading="lazy"
                        width={60}
                        height={60}
                        src={integration.logo}
                        className="rounded-full"
                      />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "flex h-[60px] w-[60px] items-center justify-center rounded-full shadow-md",
                        integration.bg
                      )}
                    >
                      <Icon className={cn("size-7", integration.color)} />
                    </div>
                  )}
                </div>
                <div className="pt-6">
                  <h3 className="text-foreground text-[20px] leading-tight font-medium">
                    {t(`items.${i}.name`)}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-base font-normal">
                    {t(`items.${i}.description`)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="text-muted-foreground text-md mx-auto mt-10 max-w-3xl font-normal md:mt-20">
          {t("subtitle")}
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            href="/integrations"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 h-12 px-6 py-[14px] w-full sm:w-auto"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
