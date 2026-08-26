import type { MetadataRoute } from "next";
import { reports } from "@/lib/reports";
import { STANDARDS } from "@/lib/standards-data";

/**
 * Sitemap per a cercadors i motors d'IA (AEO).
 * Totes les rutes són estàtiques o derivades de dades del repo —
 * res a configurar a l'hora de desplegar a Vercel.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://criteriesg.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/informes`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/estandares-esg`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/estandares-esg/gri`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/preus`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/que-fem`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/qui-som`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/mas-alla-del-checkbox`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/registro`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
  ];

  // Els 16 estàndards: pàgina de detall per a cadascun
  const standardPages: MetadataRoute.Sitemap = STANDARDS.map((s) => ({
    url: `${baseUrl}/estandares-esg/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const reportPages: MetadataRoute.Sitemap = reports.map((report) => ({
    url: `${baseUrl}/informes/${report.slug}`,
    lastModified: new Date(report.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...standardPages, ...reportPages];
}
