import type { MetadataRoute } from "next";

function baseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = baseUrl();
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/araclar/baslik-uretici`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/araclar/kar-hesaplayici`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/toplu`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/araclar/anahtar-kelime`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/araclar/toplu-fiyat`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/sablonlar`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    { url: `${base}/panel`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
