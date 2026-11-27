"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { MessageSquare, Webhook, Mail, BarChart3, Zap, Construction } from "lucide-react";
import { cn } from "@/lib/utils";
import { fireTrackingPixel } from "@/lib/tracking";
import type { LucideIcon } from "lucide-react";
import { CtaSection } from "@/components/landing/cta-section";

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
    bg: "bg-primary",
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

export default function IntegrationsPage() {
  const t = useTranslations("integrationsSection");
  const navT = useTranslations("nav");

  return (
    <div className="">
      {/* Integrations Hero Section */}
      <section id="metafi-integrations-hero" className=" px-6 lg:px-0 py-12">
        <div className="container max-w-[1200px] mx-auto px-0 md:px-6">
          <div className="bg-card/30 relative overflow-hidden rounded-[24px]">
            <div className="absolute inset-0 rounded-[24px] border border-border/60 pointer-events-none [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.1),black_30%)]" />
            <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:px-8 sm:py-20 md:py-24">
              <p className="text-primary mb-4 text-sm sm:text-base font-medium uppercase tracking-wider">
                {t("tagline")}
              </p>
              <h1 className="text-foreground text-4xl leading-tight font-medium tracking-tight text-balance sm:text-5xl md:text-[68px]">
                {t("title")}
              </h1>
              <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-base sm:text-lg">
                {t("subtitle")}
              </p>
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
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
                <Link 
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 h-12 px-6 py-[14px] w-full sm:w-auto" 
                  href="/signup"
                  data-umami-event="CTA Click"
                  data-umami-event-location="Integrations"
                  data-umami-event-label="Get Started"
                  onClick={() => fireTrackingPixel("signup")}
                >
                  {t("cta")}
                </Link>
                <Link 
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-background text-foreground border border-border shadow-xs hover:bg-muted h-12 px-6 py-[14px] w-full sm:w-auto" 
                  href="/contact"
                  data-umami-event="CTA Click"
                  data-umami-event-location="Integrations"
                  data-umami-event-label="Contact Us"
                  onClick={() => fireTrackingPixel("contact")}
                >
                  {navT("contact")}
                </Link>
              </div>
            </div>
          </div>
          <div className="h-6 sm:h-8"></div>
        </div>
      </section>

      {/* All Integrations Section */}
      <section id="metafi-all-integrations" className="bg-background px-6 lg:px-0">
        <div className="container max-w-[1200px] mx-auto px-0 py-16 sm:py-20 md:px-6 md:py-24">
          <h2 className="text-foreground text-center text-[40px] leading-tight font-medium tracking-tight md:text-[52px]">
            {t("tagline")}
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-18 lg:grid-cols-3">
            {integrations.map((integration, i) => {
              const Icon = integration.icon;
              return (
                <li key={integration.key} className="h-full">
                  <Link 
                    className="block h-full transition-transform hover:translate-y-[-2px]" 
                    aria-label={`${integration.key} integration`} 
                    href="#"
                  >
                    <article className="bg-card border-border shadow-sm h-full rounded-xl border p-4 hover:border-primary/50 transition-colors">
                      <div className="bg-accent flex h-[200px] w-full items-center justify-center rounded-lg overflow-hidden">
                        {integration.logo ? (
                          <img 
                            alt={`${integration.key} logo`} 
                            loading="lazy" 
                            width={80} 
                            height={80} 
                            decoding="async" 
                            className="h-20 w-20 object-contain p-2 rounded-md" 
                            src={integration.logo} 
                          />
                        ) : (
                          <div className={cn("flex h-20 w-20 items-center justify-center rounded-lg shadow-sm", integration.bg)}>
                            <Icon className={cn("size-10", integration.color)} />
                          </div>
                        )}
                      </div>
                      <h3 className="text-foreground mt-4 text-2xl font-medium">
                        {t(`items.${i}.name`)}
                      </h3>
                      <p className="text-muted-foreground mt-2 text-[18px] leading-snug">
                        {t(`items.${i}.description`)}
                      </p>
                    </article>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
