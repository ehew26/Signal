import type { MetadataRoute } from "next";
import { store } from "@/lib/store";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/order/"],
    },
    sitemap: `${store.url}/sitemap.xml`,
  };
}
