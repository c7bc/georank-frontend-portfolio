import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://georank.site";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/settings", "/onboarding", "/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
