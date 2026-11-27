"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SquareKanban,
  ChartNoAxesColumnIncreasing,
  ChartPie,
  Database,
  Layers
} from "lucide-react";

import { PreviewDashboard } from "@/components/landing/previews/preview-dashboard";
import { PreviewKeywords } from "@/components/landing/previews/preview-keywords";
import { PreviewCompetitors } from "@/components/landing/previews/preview-competitors";
import { PreviewRecommendations } from "@/components/landing/previews/preview-recommendations";
import { PreviewReports } from "@/components/landing/previews/preview-reports";
import { PreviewLayout } from "@/components/landing/previews/preview-layout";

export function LpHeroSection() {
  const t = useTranslations("lp-ai-visibility.hero");
  const router = useRouter();
  const [domain, setDomain] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = domain.trim()
      ? `/signup?domain=${encodeURIComponent(domain.trim())}`
      : "/signup";
    router.push(url);
  };

  return (
    <section className="overflow-hidden w-full bg-background pt-16 md:pt-24 pb-0 md:pb-12">
      {/* Hero text - constrained */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative mx-auto max-w-4xl p-2 text-center">
          <h1 className="mx-1 mt-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-7xl text-balance">
            {t("title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-muted-foreground md:text-xl text-balance">
            {t("subtitle")}
          </p>
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-lg gap-2">
            <Input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder={t("inputPlaceholder")}
              className="h-12 rounded-md text-base"
            />
            <Button type="submit" size="lg" className="rounded-md font-medium px-6 h-12 text-base whitespace-nowrap">
              {t("cta")}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">{t("trust")}</p>
        </div>
      </div>

      {/* Preview - wider, outside container */}
      <div className="mt-8 md:mt-12 px-4 md:px-6">
        <Tabs defaultValue="insights" className="w-full max-w-7xl mx-auto">
          <div className="flex justify-center mb-8">
             <div className="px-2">
              <TabsList className="h-auto w-fit max-w-xs flex-wrap justify-center gap-2 md:max-w-none bg-muted/50 p-1.5 rounded-xl">
                <TabsTrigger value="insights" className="gap-1.5 py-2 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <SquareKanban className="size-4" />
                  Insights
                </TabsTrigger>
                <TabsTrigger value="metrics" className="gap-1.5 py-2 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <ChartNoAxesColumnIncreasing className="size-4" />
                  Keywords
                </TabsTrigger>
                <TabsTrigger value="trends" className="gap-1.5 py-2 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <ChartPie className="size-4" />
                  Competitors
                </TabsTrigger>
                <TabsTrigger value="sources" className="gap-1.5 py-2 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <Database className="size-4" />
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="models" className="gap-1.5 py-2 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <Layers className="size-4" />
                  Report
                </TabsTrigger>
              </TabsList>
             </div>
          </div>

          <div className="relative isolate w-full">
            <div className="relative z-10 bg-background rounded-xl border overflow-hidden ring-1 ring-border/50">
               <TabsContent value="insights" className="mt-0 focus-visible:ring-0">
                 <PreviewLayout activePage="dashboard">
                   <PreviewDashboard />
                 </PreviewLayout>
               </TabsContent>
               <TabsContent value="metrics" className="mt-0 focus-visible:ring-0">
                 <PreviewLayout activePage="keywords">
                   <PreviewKeywords />
                 </PreviewLayout>
               </TabsContent>
               <TabsContent value="trends" className="mt-0 focus-visible:ring-0">
                 <PreviewLayout activePage="competitors">
                   <PreviewCompetitors />
                 </PreviewLayout>
               </TabsContent>
               <TabsContent value="sources" className="mt-0 focus-visible:ring-0">
                 <PreviewLayout activePage="recommendations">
                   <PreviewRecommendations />
                 </PreviewLayout>
               </TabsContent>
               <TabsContent value="models" className="mt-0 focus-visible:ring-0">
                 <PreviewLayout activePage="reports">
                   <PreviewReports />
                 </PreviewLayout>
               </TabsContent>
            </div>
          </div>
        </Tabs>

        {/* Grid Background Effect */}
        <div className="relative mt-10 h-20 overflow-hidden mask-image-b-0 max-w-7xl mx-auto">
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
      </div>
    </section>
  );
}
