import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const publicRoutes = [
  "",
  "/about",
  "/changelog",
  "/contact",
  "/docs",
  "/docs/api-reference",
  "/features",
  "/pricing",
  "/privacy-policy",
  "/terms-of-service",
  "/dpdp-compliance",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
