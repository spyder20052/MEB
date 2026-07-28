import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/pourquoi",
    "/comment",
    "/services",
    "/evenements",
    "/communaute",
    "/a-propos",
    "/prendre-rdv",
    "/projets",
    "/collaborateurs",
    "/faq",
  ];

  return pages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/evenements" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/prendre-rdv" ? 0.9 : 0.7,
  }));
}
