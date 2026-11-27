import { LpHeroSection } from "@/components/landing/lp-hero-section";
import { LpValueProps } from "@/components/landing/lp-value-props";
import { SocialProofCarousel } from "@/components/landing/social-proof-carousel";
import { CtaSection } from "@/components/landing/cta-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check your AI Visibility Score - GeoRank",
  description: "Enter your domain to see how ChatGPT, Claude, and Perplexity see your brand.",
  robots: {
    index: true,
    follow: true,
  }
};

export default function AdsLandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LpHeroSection />
      <SocialProofCarousel />
      <LpValueProps />
      <CtaSection />
    </div>
  );
}
