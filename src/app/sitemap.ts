import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllCardSlugs } from "@/data/cards";
import { templates } from "@/data/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticRoutes = ["", "/features", "/templates", "/pricing", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
    }),
  );

  const cardRoutes = getAllCardSlugs().map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: new Date(),
  }));

  const previewRoutes = templates.map((t) => ({
    url: `${base}/preview/${t.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...cardRoutes, ...previewRoutes];
}
