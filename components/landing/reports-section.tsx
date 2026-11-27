"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { CircleCheck, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fireTrackingPixel } from "@/lib/tracking";

/* ── Data ──────────────────────────────────────────────── */

const competitors = [
  { name: "HubSpot", score: "90.1%", bg: "bg-orange-500", text: "text-white", letter: "HS", logo: "https://img.icons8.com/external-tal-revivo-color-tal-revivo/1200/external-hubspot-a-developer-and-marketer-of-software-products-logo-color-tal-revivo.jpg" },
  { name: "Your Brand", score: "88.1%", bg: "bg-primary", text: "text-primary-foreground", letter: "YB", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT56ADZTFAOWTzOnS5HV-d94_2bOzMgyZUhog&s" },
  { name: "Notion", score: "87.3%", bg: "bg-neutral-800", text: "text-white", letter: "NO", logo: "https://prowly-prod.s3.eu-west-1.amazonaws.com/uploads/60169/assets/601039/-1f98f505180d14739e58c06d7a11eaea.png" },
  { name: "Slack", score: "86.9%", bg: "bg-purple-500", text: "text-white", letter: "SL", logo: "https://www.conversion.com.br/wp-content/uploads/2019/03/ahrefs-thumb.jpg" },
  { name: "Asana", score: "82.4%", bg: "bg-rose-500", text: "text-white", letter: "AS", logo: "https://images.softwaresuggest.com/software_logo/surferseo-20240715151729.png" },
];

const platforms = [
  { label: "ChatGPT", icon: "/platforms/chatgpt.png", height: 95, color: "#ffffff" },
  { label: "Overview", icon: "/platforms/gemini.png", height: 52, color: "#555555" },
  { label: "Perplexity", icon: "/platforms/perplexity.png", height: 83, color: "#444444" },
];

const contentScores = [
  { label: "Content Freshness", score: 91, color: "bg-emerald-500", issues: 2 },
  { label: "Content Structure", score: 89, color: "bg-emerald-500", issues: 2 },
  { label: "Readability", score: 54, color: "bg-amber-500", issues: 2 },
];

/* ── Gauge constants ───────────────────────────────────── */

const GAUGE_R = 70;
const GAUGE_CX = 100;
const GAUGE_CY = 85;
const GAUGE_STROKE = 14;
const GAUGE_CIRC = Math.PI * GAUGE_R;
const GAUGE_FILL = 0.91;
const GAUGE_DASH = GAUGE_FILL * GAUGE_CIRC;
const GAUGE_ANGLE_RAD = ((180 - GAUGE_FILL * 180) * Math.PI) / 180;
const GAUGE_IX = GAUGE_CX + GAUGE_R * Math.cos(GAUGE_ANGLE_RAD);
const GAUGE_IY = GAUGE_CY - GAUGE_R * Math.sin(GAUGE_ANGLE_RAD);

/* ── Visual Preview ────────────────────────────────────── */

function ReportsVisualPreview() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm [mask-image:linear-gradient(to_top,transparent_10%,black_50%)]">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-2.5">
        <div className="h-[10px] w-[10px] rounded-full bg-red-400/80" />
        <div className="h-[10px] w-[10px] rounded-full bg-yellow-400/80" />
        <div className="h-[10px] w-[10px] rounded-full bg-green-400/80" />
      </div>

      {/* Report header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2.5">
          <Image
            src="/favicon.svg"
            alt="GeoRank"
            width={20}
            height={20}
            className="rounded"
          />
          <span className="text-[12px] font-semibold leading-none text-foreground">GeoRank</span>
          <span className="text-[12px] leading-none text-muted-foreground">Report</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Link2 className="size-3" />
          <span className="text-[11px] leading-none">Copy link</span>
        </div>
      </div>

      {/* AI Visibility Ranking */}
      <div className="px-5 pt-5 pb-2">
        <h3 className="mb-3 text-[13px] font-semibold leading-none text-foreground">
          AI Visibility Ranking
        </h3>

        <div className="flex gap-3">
          {/* Competitor table */}
          <div className="flex-1 overflow-hidden rounded-lg border border-border">
            {competitors.map((item, i) => (
              <div
                key={item.name}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-[9px]",
                  i === 0 && "bg-muted/60",
                  i > 0 && "border-t border-border/50"
                )}
              >
                <span className="w-3 text-center text-[11px] leading-none text-muted-foreground/60">
                  {i + 1}
                </span>
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="h-[18px] w-[18px] rounded object-cover"
                  />
                ) : (
                  <div
                    className={cn(
                      "flex h-[18px] w-[18px] items-center justify-center rounded text-[9px] font-bold leading-none",
                      item.bg,
                      item.text
                    )}
                  >
                    {item.letter}
                  </div>
                )}
                <span className="flex-1 text-[12px] leading-none text-foreground/70">
                  {item.name}
                </span>
                <span className="text-[12px] font-medium leading-none text-foreground/90">
                  {item.score}
                </span>
              </div>
            ))}
          </div>

          {/* AI platforms bar chart */}
          <div className="w-[45%] rounded-lg border border-border p-3">
            <div className="flex h-full flex-col">
              {/* Chart area */}
              <div className="relative flex flex-1 items-end">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 flex h-full flex-col justify-between pb-1 pt-0">
                  {[100, 80, 60, 40, 20].map((v) => (
                    <span key={v} className="text-[8px] leading-none text-muted-foreground/40">
                      {v}
                    </span>
                  ))}
                </div>

                {/* Bars */}
                <div className="ml-6 flex flex-1 items-end justify-around gap-2">
                  {platforms.map((bar) => (
                    <div key={bar.label} className="flex flex-col items-center gap-1.5">
                      <div
                        className="w-6 rounded-t bg-primary"
                        style={{
                          height: `${bar.height * 0.8}px`,
                          opacity: bar.height / 100,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* X-axis labels with icons */}
              <div className="ml-6 mt-2 flex justify-around">
                {platforms.map((bar) => (
                  <div key={bar.label} className="flex flex-col items-center gap-1">
                    <Image
                      src={bar.icon}
                      alt={bar.label}
                      width={14}
                      height={14}
                      className="rounded-sm"
                    />
                    <span className="max-w-[56px] text-center text-[7px] leading-tight text-muted-foreground/60">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Score */}
      <div className="px-5 pt-3 pb-5">
        <h3 className="mb-3 text-[13px] font-semibold leading-none text-foreground">
          Content Score
        </h3>

        <div className="flex overflow-hidden rounded-lg border border-border">
          {/* Gauge */}
          <div className="flex flex-1 items-center justify-center p-4">
            <svg viewBox="0 0 200 110" className="w-full max-w-[180px]">
              <path
                d={`M ${GAUGE_CX - GAUGE_R},${GAUGE_CY} A ${GAUGE_R},${GAUGE_R} 0 0,1 ${GAUGE_CX + GAUGE_R},${GAUGE_CY}`}
                fill="none"
                className="stroke-muted"
                strokeWidth={GAUGE_STROKE}
                strokeLinecap="round"
              />
              <path
                d={`M ${GAUGE_CX - GAUGE_R},${GAUGE_CY} A ${GAUGE_R},${GAUGE_R} 0 0,1 ${GAUGE_CX + GAUGE_R},${GAUGE_CY}`}
                fill="none"
                className="stroke-primary"
                strokeWidth={GAUGE_STROKE}
                strokeLinecap="round"
                strokeDasharray={`${GAUGE_DASH} ${GAUGE_CIRC}`}
              />
              <circle
                cx={GAUGE_IX}
                cy={GAUGE_IY}
                r={5}
                className="fill-primary stroke-card"
                strokeWidth={2}
              />
              <text
                x={GAUGE_CX}
                y={GAUGE_CY - 2}
                textAnchor="middle"
                dominantBaseline="auto"
                className="fill-foreground text-[32px] font-bold"
              >
                91%
              </text>
            </svg>
          </div>

          {/* Score metrics */}
          <div className="flex flex-1 flex-col border-l border-border">
            {contentScores.map((metric, i) => (
              <div
                key={metric.label}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5",
                  i > 0 && "border-t border-border/50"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] font-bold leading-none text-white",
                    metric.color
                  )}
                >
                  {metric.score}
                </div>
                <span className="flex-1 text-[11px] leading-none text-foreground/70">
                  {metric.label}
                </span>
                <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[9px] leading-none text-muted-foreground">
                  {metric.issues} issues
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Reports Section ───────────────────────────────────── */

export function ReportsSection() {
  const t = useTranslations("reportsSection");

  const checklistItems = [
    t("checklist.0"),
    t("checklist.1"),
    t("checklist.2"),
    t("checklist.3"),
  ];

  return (
    <section className="bg-background px-6 lg:px-0">
      <div className="container max-w-[1200px] mx-auto px-0 py-16 sm:py-20 md:px-6 md:py-28">
        {/* Single bordered container */}
        <div className="relative flex flex-col items-stretch overflow-hidden rounded-[16px] border border-border bg-card md:flex-row">
          <div className="flex w-full flex-col gap-0 md:flex-row">
            {/* Left: Content */}
            <div className="flex w-full flex-1 shrink-0 flex-col gap-6 p-8 md:w-1/2 md:p-10">
              <div className="flex flex-col items-start gap-4">
                <h2 className="text-foreground text-2xl leading-tight font-medium tracking-tight text-balance sm:text-3xl md:text-4xl">
                  {t("title")}
                </h2>

                <p className="text-muted-foreground max-w-[80%] text-pretty text-left text-sm sm:text-base">
                  {t("subtitle")}
                </p>

                {/* CTA Button */}
                <div className="flex w-full max-w-[80%] flex-col gap-4 py-4">
                  <Button
                    asChild
                    className="w-full rounded-xl h-12 text-sm font-semibold"
                  >
                    <Link href="/signup" onClick={() => fireTrackingPixel("signup")} data-umami-event="CTA Click" data-umami-event-location="Reports" data-umami-event-label="Start Monitoring">
                      {t("cta")}
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Checklist */}
              <div className="flex w-full flex-col items-start gap-4">
                <p className="text-foreground text-sm font-medium">
                  {t("checklistLabel")}
                </p>
                <div className="flex w-full flex-col items-center gap-3 px-0 py-1 md:items-start md:border-l md:border-l-border md:px-4">
                  <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-1">
                    {checklistItems.map((item, i) => (
                      <div key={i} className="flex w-full items-center gap-3 md:w-fit md:px-0">
                        <CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                        <p className="text-muted-foreground text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual Preview (bleeds/overflows) */}
            <div className="relative h-fit w-full overflow-visible md:flex md:h-full md:w-1/2">
              <div className="relative top-8 left-0 w-full md:absolute md:left-0 md:top-4 md:h-auto md:w-auto md:min-w-[calc(100%+60px)]">
                <div className="overflow-hidden rounded-l-xl border border-border/60 bg-card shadow-lg md:rounded-r-none">
                  <ReportsVisualPreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
