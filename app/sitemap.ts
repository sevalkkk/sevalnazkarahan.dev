import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sevalnazkarahan.dev";
  const currentDate = new Date();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          tr: `${baseUrl}`,
          en: `${baseUrl}/?lang=en`,
        },
      },
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          tr: `${baseUrl}/contact`,
          en: `${baseUrl}/contact?lang=en`,
        },
      },
    },
  ];
}
