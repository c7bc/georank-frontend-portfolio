import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/hero-section";
import { SocialProof } from "@/components/landing/social-proof";
import { FeaturesSection } from "@/components/landing/features-section";
import { ReportsSection } from "@/components/landing/reports-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { Testimonials } from "@/components/landing/testimonials";
import { BlogSection } from "@/components/landing/blog-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";

export const metadata: Metadata = {
  title: "GeoRank — SEO for the AI Era",
  description:
    "Monitor and optimize your brand's visibility in ChatGPT, Claude, Perplexity, and Gemini. Track your GEO Score, monitor competitor mentions, and get actionable GEO recommendations.",
  alternates: {
    canonical: "https://georank.site",
  },
  openGraph: {
    url: "https://georank.site",
    title: "GeoRank — SEO for the AI Era",
    description:
      "Monitor and optimize your brand's visibility in AI responses. The leading GEO (Generative Engine Optimization) platform.",
  },
};



export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <SocialProof />
      <FeaturesSection />
      <ReportsSection />
      <IntegrationsSection />
      <PricingSection />
      <Testimonials />
      {/* <BlogSection /> */}
      <FaqSection />
      <CtaSection />
    </>
  );
}
