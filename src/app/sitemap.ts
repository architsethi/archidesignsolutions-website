import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data";

// Refreshed hourly — new posts should be discoverable without a redeploy, but
// this does not need to be as current as the pages themselves.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://archidesignsolutions.com";

  const data = await getSiteData();
  const posts: MetadataRoute.Sitemap = (data.blogs || [])
    .filter((b) => b.status === "published")
    .map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: new Date(b.updatedAt || b.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...posts,
  ];
}
