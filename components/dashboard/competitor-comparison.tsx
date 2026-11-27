"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { Users, ArrowRight } from "lucide-react";

const chartConfig = {
  score: {
    label: "GEO Score",
    color: "var(--primary)",
  },
};

interface CompetitorData {
  name: string;
  score: number;
}

interface CompetitorComparisonProps {
  data?: CompetitorData[];
}

export function CompetitorComparison({ data = [] }: CompetitorComparisonProps) {
  const t = useTranslations("dashboard.competitors");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold">{t("title")}</h3>
          <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Link
          href="/competitors"
          className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          {t("viewDetails")} <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card/30 p-6 pt-8">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Users className="h-8 w-8 mb-2 opacity-50" />
            <p className="font-medium text-sm">{t("emptyTitle")}</p>
            <p className="text-xs">{t("emptyDescription")}</p>
          </div>
        ) : (
          <ChartContainer id="competitor-comparison-chart" config={chartConfig} className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ left: 120, right: 40 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--foreground)", fontSize: 13, fontWeight: 500 }}
                  width={110}
                />
                <ChartTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  content={
                    <ChartTooltipContent 
                      indicator="dot"
                      className="bg-background/95 backdrop-blur-sm border-border"
                    />
                  } 
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={28} animationDuration={1000}>
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={index === 0 ? "var(--primary)" : "var(--muted-foreground)"}
                      opacity={index === 0 ? 1 : 0.2}
                      className="transition-all duration-300"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
