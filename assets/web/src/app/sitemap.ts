import type { MetadataRoute } from "next";
import { reports } from "@/lib/reports";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://criteriesg.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/informes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const reportPages: MetadataRoute.Sitemap = reports.map((report) => ({
    url: `${baseUrl}/informes/${report.slug}`,
    lastModified: new Date(report.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...reportPages];
}
