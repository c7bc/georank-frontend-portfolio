import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import Script from "next/script";
import "./globals.css";

import { ThemeProvider } from "@/contexts/theme-context";
import { PublicPageWrapper } from "@/components/layouts/public-page-wrapper";

const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const analyticsUrl = process.env.ANALYTICS_SCRIPT_URL;
const analyticsSite = process.env.ANALYTICS_SITE_ID;
const conversionTag = process.env.GOOGLE_ADS_TAG_ID;

const BASE_URL = "https://georank.site";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: "%s | GeoRank",
    default: "GeoRank — SEO for the AI Era",
  },
  description:
    "Monitor and optimize your brand's visibility in ChatGPT, Claude, Perplexity, and Gemini. Track your GEO Score, monitor brand mentions in AI responses, analyze competitors, and get actionable recommendations.",
  keywords: [
    "AI SEO",
    "GEO",
    "Generative Engine Optimization",
    "AI search optimization",
    "ChatGPT SEO",
    "Perplexity SEO",
    "Claude SEO",
    "Gemini SEO",
    "AI visibility",
    "brand monitoring AI",
    "GEO Rank",
    "AI mentions tracking",
    "AI search ranking",
    "LLM SEO",
    "answer engine optimization",
    "GeoRank",
  ],
  authors: [{ name: "GeoRank", url: BASE_URL }],
  creator: "GeoRank",
  publisher: "GeoRank",
  category: "Technology",
  applicationName: "GeoRank",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["pt_BR", "es_ES"],
    url: BASE_URL,
    siteName: "GeoRank",
    title: "GeoRank — SEO for the AI Era",
    description:
      "Monitor and optimize your brand's visibility in ChatGPT, Claude, Perplexity, and Gemini — the leading platform for AI search optimization.",
    images: [
      {
        url: "/images/image.png",
        width: 1200,
        height: 630,
        alt: "GeoRank — SEO for the AI Era. Monitor your brand in ChatGPT, Perplexity, Claude and Gemini.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@georank_site",
    creator: "@georank_site",
    title: "GeoRank — SEO for the AI Era",
    description:
      "Monitor and optimize your brand's visibility in ChatGPT, Claude, Perplexity, and Gemini — the leading platform for AI search optimization.",
    images: ["/images/image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest"
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GeoRank",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.svg`,
  description:
    "GeoRank is the leading SEO platform for the AI era. Monitor and optimize your brand's visibility in ChatGPT, Claude, Perplexity, and Gemini responses.",
  sameAs: [
    "https://twitter.com/georank_site",
    "https://linkedin.com/company/georank",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${BASE_URL}/contact`,
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "GeoRank",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: BASE_URL,
  description:
    "AI search visibility and GEO (Generative Engine Optimization) platform. Track your GEO Score, monitor brand mentions in LLMs, analyze competitors, and get actionable recommendations.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, messages, cookieStore] = await Promise.all([getLocale(), getMessages(), cookies()]);
  const themeCookie = cookieStore.get("georank-theme")?.value;
  const themeClass = themeCookie === "dark" || themeCookie === "light" ? themeCookie : undefined;

  return (
    <html suppressHydrationWarning className={`${inter.variable}${themeClass ? ` ${themeClass}` : ""}`} lang={locale}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;if(d.classList.contains('dark')||d.classList.contains('light'))return;d.classList.add(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')})()`,
          }}
        />
        {conversionTag && /^AW-\d+$/.test(conversionTag) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${conversionTag}`} strategy="afterInteractive" />
            <Script id="google-tag" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config","${conversionTag}");`}
            </Script>
          </>
        )}
        {analyticsUrl && analyticsSite && (
          <Script src={analyticsUrl} data-website-id={analyticsSite} strategy="afterInteractive" />
        )}
        <Script
          id="schema-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="schema-software"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="georank-theme">
          <NextIntlClientProvider messages={messages}>
            <PublicPageWrapper>{children}</PublicPageWrapper>
          </NextIntlClientProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
