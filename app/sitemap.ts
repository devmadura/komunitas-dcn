import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dcnunira.dev";

  // Fetch all published events
  const { data: events } = await supabase
    .from("events")
    .select("slug, created_at")
    .eq("is_published", true)
    .order("tanggal", { ascending: false });

  // Generate event URLs
  const eventUrls: MetadataRoute.Sitemap = (events || []).map((event) => ({
    url: `${baseUrl}/event/${event.slug}`,
    lastModified: new Date(event.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/redeem`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sertifikat/klaim`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/event`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // All event detail pages
    ...eventUrls,
  ];
}
