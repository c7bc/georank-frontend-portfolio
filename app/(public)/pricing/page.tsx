import type { Metadata } from "next";
import { PricingHeroSection } from "@/components/landing/pricing-hero-section";
import { FeaturesIncludedSection } from "@/components/landing/features-included-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "GeoRank pricing plans for teams of all sizes. Start free and scale as your AI search visibility grows. Monitor ChatGPT, Perplexity, Claude, and Gemini for your brand.",
  alternates: {
    canonical: "https://georank.site/pricing",
  },
  openGraph: {
    url: "https://georank.site/pricing",
    title: "Pricing — GeoRank",
    description:
      "Start for free. Monitor your brand in AI search engines like ChatGPT, Perplexity, Claude, and Gemini.",
  },
};



export default function PricingPage() {
  return (
    <>
      <PricingHeroSection />
      <FeaturesIncludedSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
