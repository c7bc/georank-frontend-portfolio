import type { Metadata } from "next";
import { FeaturesAndPricing } from "@/components/landing/features-and-pricing";
import { FaqSection } from "@/components/landing/faq-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { CtaSection } from "@/components/landing/cta-section";

export const metadata: Metadata = {
  title: "Features",
  description:
    "GeoRank features: GEO Score tracking, AI brand mention monitoring, competitor analysis, actionable recommendations, and automated reports. The complete toolkit for AI search optimization.",
  alternates: {
    canonical: "https://georank.site/features",
  },
  openGraph: {
    url: "https://georank.site/features",
    title: "Features — GeoRank",
    description:
      "GEO Score, AI mention tracking, competitor analysis, and automated reports. Everything you need to dominate AI search.",
  },
};



export default function FeaturesPage() {
  return (
    <>
      <FeaturesAndPricing />
      <IntegrationsSection />
      <CtaSection />
    </>
  );
}
