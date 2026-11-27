import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read GeoRank's Privacy Policy. Learn how we collect, use, and protect your personal data in compliance with GDPR and LGPD.",
  alternates: { canonical: "https://georank.site/privacy" },
  robots: { index: true, follow: false },
};

export default function PrivacyPage() {
  return <LegalPage translationNamespace="privacy" />;
}
