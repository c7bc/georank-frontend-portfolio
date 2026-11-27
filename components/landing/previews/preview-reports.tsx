"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  BarChart2,
  Layers,
  Users,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Circle,
  Calendar,
  TrendingUp,
  Target,
  Search,
  Globe,
  BookOpen,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// ── Mock Data ──

const geoScore = 72;
const mentionRate = 48.3;
const keywordsTracked = 24;
const platformsTracked = 4;
const domain = "yourbrand.com";
const period = "Feb 1 – Feb 14, 2025";

const scoreColor = "text-amber-500";
const scoreBg = "bg-amber-500";

const performanceMetrics = [
  { label: "AI Mention Rate", value: "48.3%", note: "Below benchmark", color: "text-amber-500" },
  { label: "GEO Score", value: "72/100", note: "Above industry avg", color: "text-emerald-500" },
  { label: "Keywords", value: "24", note: "tracked keywords", color: "text-foreground" },
  { label: "Platforms", value: "4", note: "AI platforms tracked", color: "text-foreground" },
  { label: "Top Keyword", value: "best ai seo tools", note: "Score: 91", color: "text-emerald-500" },
  { label: "Needs Work", value: "chatgpt seo strategy", note: "Score: 34", color: "text-red-500" },
];

const sitePages = [
  { title: "Homepage", path: "/", type: "landing", summary: "Main entry point with strong SEO signals. Well-structured content hierarchy detected.", ai_mentions: 18 },
  { title: "Product Features", path: "/features", type: "product", summary: "Feature comparison page with good keyword density but missing JSON-LD schema markup.", ai_mentions: 12 },
  { title: "Pricing Plans", path: "/pricing", type: "pricing", summary: "Clean pricing layout. Could benefit from FAQ schema for common pricing questions.", ai_mentions: 7 },
];

const platforms = [
  { platform: "chatgpt", label: "ChatGPT", rate: 62.1, status: "strong", insight: "Dominant in product recommendations" },
  { platform: "claude", label: "Claude", rate: 51.4, status: "moderate", insight: "Growing presence in technical queries" },
  { platform: "perplexity", label: "Perplexity", rate: 44.8, status: "moderate", insight: "Cited in comparison searches" },
  { platform: "gemini", label: "Gemini", rate: 35.0, status: "weak", insight: "Limited visibility, needs optimization" },
];

const maxRate = 62.1;
const minRate = 35.0;

const benchmarks = [
  { label: "AI Mention Rate", yours: 48, industry: 35, top: 78 },
  { label: "Content Authority", yours: 62, industry: 50, top: 88 },
  { label: "Schema Coverage", yours: 30, industry: 45, top: 92 },
  { label: "Citation Strength", yours: 55, industry: 40, top: 85 },
];

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

const TREND_ICONS = [TrendingUp, Users, Target, Search];

const marketTrends = [
  {
    title: "AI-First Search Growing",
    description: "More users are starting their product research directly in AI chat interfaces rather than traditional search engines.",
    bullets: ["ChatGPT search up 140% YoY", "Perplexity gaining market share in B2B"],
  },
  {
    title: "Structured Data Critical",
    description: "Brands with comprehensive schema markup see 3x higher mention rates across all AI platforms.",
    bullets: ["JSON-LD adoption up 65%", "FAQ schema drives 2x more citations"],
  },
  {
    title: "Authority Signals Evolving",
    description: "AI models are increasingly weighing domain authority and citation networks when selecting sources.",
    bullets: ["Backlink quality > quantity", "Industry publications matter more"],
  },
  {
    title: "Multi-Platform Presence",
    description: "Brands visible across multiple AI platforms see compounding benefits from cross-platform citations.",
    bullets: ["4+ platform presence = 2.5x score", "Platform-specific optimization needed"],
  },
];

const competitors = [
  { domain: "competitor-a.com", score: 85, is_you: false },
  { domain: "yourbrand.com", score: 72, is_you: true },
  { domain: "competitor-b.com", score: 61, is_you: false },
  { domain: "competitor-c.com", score: 54, is_you: false },
];

const competitorIntel = [
  { name: "Competitor A", domain: "competitor-a.com", founded: "2019", trust_signals: "SOC2, G2 Leader, 500+ reviews", ai_presence: "dominant" },
  { name: "Your Brand", domain: "yourbrand.com", founded: "2021", trust_signals: "ISO 27001, 120+ reviews", ai_presence: "moderate" },
  { name: "Competitor B", domain: "competitor-b.com", founded: "2020", trust_signals: "Featured in TechCrunch", ai_presence: "moderate" },
  { name: "Competitor C", domain: "competitor-c.com", founded: "2022", trust_signals: "Y Combinator backed", ai_presence: "weak" },
];

const risks = [
  { title: "Low visibility on Gemini platform", priority: "HIGH", description: "Your brand appears in less than 15% of relevant Gemini queries. Competitors are 2x more visible." },
  { title: "Declining mention rate on Perplexity", priority: "MEDIUM", description: "Week-over-week decline of 8% in Perplexity mentions across tracked keywords." },
  { title: "Missing structured data on key pages", priority: "CRITICAL", description: "Product and FAQ pages lack schema markup that AI crawlers use for structured answers." },
];

const recommendations = [
  { title: "Add structured data to product pages", priority: "HIGH", impact: "+8-12 pts", description: "Implement JSON-LD schema for products, FAQs, and reviews to improve AI crawlability." },
  { title: "Build citations on authoritative sources", priority: "HIGH", impact: "+5-8 pts", description: "Target industry publications and review sites to increase source authority signals." },
  { title: "Create FAQ content for top queries", priority: "MEDIUM", impact: "+3-5 pts", description: "AI platforms frequently cite FAQ-style content. Cover your top 10 tracked keywords." },
];

const citations = [
  { url: "g2.com/products/yourbrand/reviews", title: "YourBrand Reviews 2025", snippet: "Comprehensive user reviews and ratings for YourBrand's AI visibility platform." },
  { url: "techcrunch.com/2025/01/ai-seo-tools", title: "Best AI SEO Tools in 2025", snippet: "A roundup of the top AI-powered SEO and visibility tracking tools for modern marketers." },
  { url: "searchengineland.com/geo-optimization", title: "GEO: The New SEO", snippet: "How generative engine optimization is reshaping brand discovery in the age of AI assistants." },
  { url: "hubspot.com/marketing/ai-visibility", title: "AI Visibility Guide", snippet: "Complete guide to improving your brand's presence across AI-powered search platforms." },
  { url: "moz.com/blog/structured-data-ai", title: "Structured Data for AI Crawlers", snippet: "Why schema markup is now essential for AI discoverability and how to implement it correctly." },
  { url: "ahrefs.com/blog/ai-mentions", title: "Tracking AI Mentions", snippet: "How to monitor and improve your brand's mention rate across ChatGPT, Claude, and Perplexity." },
];

// ── Sub-components ──

function SectionLabel({
  icon: Icon,
  label,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  accent: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-6", accent)}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    CRITICAL: "border-red-500/30 bg-red-500/10 text-red-500",
    HIGH: "border-orange-500/30 bg-orange-500/10 text-orange-500",
    MEDIUM: "border-amber-500/30 bg-amber-500/10 text-amber-600",
    LOW: "border-border bg-muted text-muted-foreground",
  };
  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] font-bold uppercase tracking-wider px-2 h-5", styles[priority] ?? styles.LOW)}
    >
      {priority}
    </Badge>
  );
}

function aiPresenceSignal(presence: string): "green" | "yellow" | "red" {
  if (presence === "dominant" || presence === "strong") return "green";
  if (presence === "moderate") return "yellow";
  return "red";
}

// ── Main Component ──

export function PreviewReports() {
  return (
    <div className="space-y-0">
      {/* Top bar */}
      <div className="border-b border-border bg-background/95 -mx-6 -mt-6 mb-6">
        <div className="flex items-center justify-between px-6 py-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Reports
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm font-medium truncate max-w-xs">
              {domain} — {period}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize font-medium">
              weekly
            </Badge>
            <span className="text-xs text-muted-foreground hidden sm:block">Feb 14, 2025</span>
            <Button size="sm" variant="outline" className="gap-1.5 ml-1">
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Report content */}
      <div className="mx-auto max-w-4xl">

        {/* Report header */}
        <div className="mb-2 rounded-2xl border border-border/50 bg-muted/20 p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Domain
              </p>
              <h1 className="text-3xl font-bold tracking-tight">{domain}</h1>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                {period}
              </p>
            </div>
            <Button variant="outline" className="gap-2 shadow-xs self-start shrink-0">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>

          <Separator className="mb-8" />

          {/* GEO Score + key metrics */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="sm:w-48 sm:shrink-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                GEO Score
              </p>
              <p className={cn("text-4xl font-bold tabular-nums", scoreColor)}>{geoScore}</p>
              <div className="mt-3 space-y-1.5">
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", scoreBg)}
                    style={{ width: `${geoScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{geoScore}% of 100</span>
                  <span>Benchmark: 45–65</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:divide-x sm:divide-border/50">
              {[
                { label: "AI Mention Rate", value: `${mentionRate}%`, color: "text-amber-500" },
                { label: "Keywords", value: String(keywordsTracked), color: "text-foreground" },
                { label: "Platforms", value: String(platformsTracked), color: "text-foreground" },
              ].map(({ label, value, color }) => (
                <div key={label} className="sm:px-6 sm:first:pl-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 sm:mb-2">
                    {label}
                  </p>
                  <p className={cn("text-2xl sm:text-3xl font-bold tabular-nums leading-none", color)}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        <ul className="relative w-full">

          {/* 1. Executive Summary */}
          <li className="border-b py-10">
            <SectionLabel icon={Sparkles} label="Executive Summary" accent="text-primary" />
            <h2 className="text-3xl font-bold tracking-tight mb-1">
              GEO Score{" "}
              <span className={scoreColor}>{geoScore}</span>
              <span className="text-muted-foreground">/100</span>
            </h2>
            <p className="text-base leading-7 text-muted-foreground mt-4">
              Your brand demonstrates moderate AI visibility with a GEO Score of 72/100. ChatGPT shows the strongest presence with a 62.1% mention rate, while Gemini remains an opportunity area at 35%. Key improvements in structured data and citation building could push your score into the 80+ range within the next reporting period.
            </p>
          </li>

          {/* 2. Site Overview */}
          <li className="border-b py-10">
            <SectionLabel icon={Globe} label="Site Overview" accent="text-[var(--chart-4)]" />

            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Crawler partially blocked (robots.txt):</strong>{" "}
                Some AI crawlers are restricted from accessing key pages. Update your robots.txt to allow GPTBot and ClaudeBot.
              </AlertDescription>
            </Alert>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              AI crawler analysis of {domain} — pages discovered and evaluated during this report period.
            </p>

            <div>
              {sitePages.map((page) => (
                <div key={page.path} className="border-b border-border/60 py-5 last:border-0">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold">{page.title}</h3>
                        <Badge variant="secondary" className="text-[10px] h-5">
                          {page.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 font-mono">{page.path}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{page.summary}</p>
                    </div>
                    <div className="flex sm:flex-col sm:items-end gap-3 sm:gap-2 sm:shrink-0">
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 gap-1 border-primary/20 bg-primary/5 text-primary w-fit"
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        {page.ai_mentions} mentions
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </li>

          {/* 3. Performance Analysis */}
          <li className="border-b py-10">
            <SectionLabel icon={BarChart2} label="Performance Analysis" accent="text-[var(--chart-1)]" />
            <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-3">
              {performanceMetrics.map(({ label, value, note, color }) => (
                <div key={label} className="rounded-xl border border-border/50 bg-muted/20 p-4">
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className={cn("text-xl font-bold tabular-nums truncate", color)}>{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{note}</p>
                </div>
              ))}
            </div>
          </li>

          {/* 4. Industry Benchmarks */}
          <li className="border-b py-10">
            <SectionLabel icon={Target} label="Industry Benchmarks" accent="text-[var(--chart-5)]" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              How {domain} compares to industry averages and top performers.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {benchmarks.map(({ label, yours, industry, top }, i) => {
                const color = CHART_COLORS[i % CHART_COLORS.length];
                return (
                  <div key={label} className="rounded-xl border border-border/50 bg-muted/20 p-5">
                    <div className="flex justify-between items-baseline mb-4">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xl font-bold tabular-nums" style={{ color }}>{yours}%</p>
                    </div>
                    <div className="space-y-2.5">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium">You</span>
                          <span className="text-muted-foreground">{yours}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${Math.min(yours, 100)}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Industry avg</span>
                          <span>{industry}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-muted-foreground/40"
                            style={{ width: `${Math.min(industry, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Top performer</span>
                          <span>{top}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-muted-foreground/20"
                            style={{ width: `${Math.min(top, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </li>

          {/* 5. Platform Breakdown */}
          <li className="border-b py-10">
            <SectionLabel icon={Layers} label="Platform Breakdown" accent="text-[var(--chart-2)]" />
            <div className="relative overflow-hidden border border-border/50 bg-background/50 backdrop-blur-sm rounded-xl">
              <div className="relative w-full overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="h-10 px-4 text-left align-middle font-semibold text-foreground">
                        Metric
                      </th>
                      {platforms.map((p) => (
                        <th
                          key={p.platform}
                          className="h-10 px-3 align-middle text-center font-semibold text-foreground"
                        >
                          {p.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mention Rate */}
                    <tr className="border-b border-border/30 transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3.5 font-medium text-foreground whitespace-nowrap">
                        Mention Rate
                      </td>
                      {platforms.map((p) => {
                        const cs = p.rate === maxRate ? "best" : p.rate === minRate ? "bad" : "neutral";
                        return (
                          <td
                            key={p.platform}
                            className={cn(
                              "px-3 py-3.5 text-center font-medium",
                              cs === "best"
                                ? "bg-green-50 text-green-600 dark:bg-green-950/20"
                                : cs === "bad"
                                ? "bg-red-50 text-red-600 dark:bg-red-950/20"
                                : "bg-muted/50 text-foreground"
                            )}
                          >
                            {p.rate.toFixed(1)}%
                          </td>
                        );
                      })}
                    </tr>
                    {/* AI Presence */}
                    <tr className="border-b border-border/30 transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3.5 font-medium text-foreground whitespace-nowrap">
                        AI Presence
                      </td>
                      {platforms.map((p) => {
                        const cs = p.status === "strong" ? "best" : p.status === "weak" ? "bad" : "neutral";
                        return (
                          <td
                            key={p.platform}
                            className={cn(
                              "px-3 py-3.5 text-center font-medium capitalize",
                              cs === "best"
                                ? "bg-green-50 text-green-600 dark:bg-green-950/20"
                                : cs === "bad"
                                ? "bg-red-50 text-red-600 dark:bg-red-950/20"
                                : "bg-muted/50 text-foreground"
                            )}
                          >
                            {p.status}
                          </td>
                        );
                      })}
                    </tr>
                    {/* Insight */}
                    <tr className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3.5 font-medium text-foreground whitespace-nowrap">
                        Insight
                      </td>
                      {platforms.map((p) => (
                        <td
                          key={p.platform}
                          className="px-3 py-3.5 text-center text-xs text-muted-foreground bg-muted/50"
                        >
                          {p.insight}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </li>

          {/* 6. Market Trends */}
          <li className="border-b py-10">
            <SectionLabel icon={TrendingUp} label="Market Trends" accent="text-[var(--chart-2)]" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Industry trends in AI search shaping your competitive landscape.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {marketTrends.map(({ title, description, bullets }, i) => {
                const Icon = TREND_ICONS[i % TREND_ICONS.length];
                return (
                  <div
                    key={title}
                    className="space-y-4 rounded-xl border border-border p-6 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-muted p-2.5 shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold">{title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                    {bullets.length > 0 && (
                      <div className="space-y-1.5">
                        {bullets.map((b) => (
                          <div key={b} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-foreground/50 shrink-0" />
                            <span className="text-sm">{b}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </li>

          {/* 7. Competitive Landscape */}
          <li className="border-b py-10">
            <SectionLabel icon={Users} label="Competitive Landscape" accent="text-[var(--chart-3)]" />
            <div className="overflow-x-auto rounded-xl border border-border/50 bg-background mb-4">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/40">
                    <th className="px-4 py-3 text-left font-semibold text-foreground w-10">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Competitor</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">GEO Score</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((c, i) => (
                    <tr
                      key={c.domain}
                      className={cn(
                        "border-b border-border/30 last:border-0 transition-colors",
                        c.is_you ? "bg-primary/5 hover:bg-primary/8" : "hover:bg-muted/20"
                      )}
                    >
                      <td className="px-4 py-3.5 text-muted-foreground font-mono text-xs">{i + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-medium", c.is_you && "text-primary")}>
                            {c.domain}
                          </span>
                          {c.is_you && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-4 px-1.5 border-primary/30 text-primary bg-primary/5"
                            >
                              You
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                c.is_you ? "bg-primary" : "bg-muted-foreground/50"
                              )}
                              style={{ width: `${Math.min(c.score, 100)}%` }}
                            />
                          </div>
                          <span className="tabular-nums text-sm font-semibold">
                            {c.score}/100
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </li>

          {/* 8. Competitor Web Research */}
          <li className="border-b py-10">
            <SectionLabel icon={Search} label="Competitor Web Research" accent="text-[var(--chart-3)]" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Real-time intelligence on competitor web presence, content strategy, and AI visibility signals.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border/50 bg-background">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/40">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Competitor</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Founded</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Trust Signals</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">AI Presence</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorIntel.map((c) => {
                    const isYou = c.domain === domain;
                    const signal = aiPresenceSignal(c.ai_presence);
                    return (
                      <tr
                        key={c.domain}
                        className={cn(
                          "border-b border-border/30 last:border-0 transition-colors",
                          isYou ? "bg-primary/5" : "hover:bg-muted/20"
                        )}
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={cn("font-medium text-sm", isYou && "text-primary")}>
                                  {c.name}
                                </span>
                                {isYou && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] h-4 px-1.5 border-primary/30 text-primary bg-primary/5"
                                  >
                                    You
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{c.domain}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground">
                          {c.founded}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground max-w-[180px] truncate">
                          {c.trust_signals}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                              signal === "green" && "bg-emerald-500/10 text-emerald-500",
                              signal === "yellow" && "bg-amber-500/10 text-amber-600",
                              signal === "red" && "bg-red-500/10 text-red-500"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full shrink-0",
                                signal === "green" && "bg-emerald-500",
                                signal === "yellow" && "bg-amber-500",
                                signal === "red" && "bg-red-500"
                              )}
                            />
                            <span className="capitalize">{c.ai_presence}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </li>

          {/* 9. Risks & Recommendations */}
          <li className="border-b py-10">
            <div className="grid gap-0 lg:grid-cols-2">
              {/* Risks */}
              <div>
                <div className="flex items-center gap-2 py-3 border-b mb-1 lg:pr-6">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Risks & Threats
                  </span>
                </div>
                {risks.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 border-b border-border/60 py-2.5 lg:pr-6 last:border-0"
                  >
                    <Circle
                      className={cn(
                        "mt-0.5 size-5 shrink-0",
                        r.priority === "CRITICAL" && "text-red-500",
                        r.priority === "HIGH" && "text-orange-500",
                        r.priority === "MEDIUM" && "text-amber-500"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug">{r.title}</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <PriorityBadge priority={r.priority} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="lg:pl-6">
                <div className="flex items-center gap-2 py-3 border-b mb-1">
                  <Lightbulb className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Recommendations
                  </span>
                </div>
                {recommendations.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 border-b border-border/60 py-2.5 last:border-0"
                  >
                    <Circle
                      className={cn(
                        "mt-0.5 size-5 shrink-0",
                        r.priority === "HIGH" && "text-orange-500",
                        r.priority === "MEDIUM" && "text-amber-500"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug">{r.title}</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <PriorityBadge priority={r.priority} />
                        {r.impact && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                            <TrendingUp className="h-3 w-3" />
                            {r.impact}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </li>

          {/* 10. Sources & Citations */}
          <li className="py-10">
            <SectionLabel icon={BookOpen} label="Sources & Citations" accent="text-muted-foreground" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Sources referenced by AI platforms during competitor research and industry analysis for this report.
            </p>
            <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
              {citations.map(({ url, title, snippet }, i) => (
                <div
                  key={i}
                  className="group flex flex-col gap-1.5 rounded-lg p-4 hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground group-hover:bg-background transition-colors">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-1">
                        <p className="text-sm font-medium leading-snug flex-1">{title}</p>
                        <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <p className="text-xs text-muted-foreground/70 font-mono truncate">{url}</p>
                    </div>
                  </div>
                  <p className="ml-8 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {snippet}
                  </p>
                </div>
              ))}
            </div>
          </li>

        </ul>
      </div>
    </div>
  );
}
