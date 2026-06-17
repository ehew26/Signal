import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/data";
import { posts } from "@/lib/content";

const BASE = "https://vertex-ai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/services",
    "/about",
    "/insights",
    "/contact",
    "/login",
    "/legal/privacy",
    "/legal/terms",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const workRoutes = caseStudies.map((c) => ({
    url: `${BASE}/work/${c.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const postRoutes = posts.map((p) => ({
    url: `${BASE}/insights/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...workRoutes, ...postRoutes];
}
