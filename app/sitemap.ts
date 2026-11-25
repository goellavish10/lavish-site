import type { MetadataRoute } from "next";
import posts from "@/content/posts.json";
import { cases } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

const site = siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", "/lab", "/play", "/writing", "/hire"];
  return [
    ...pages.map((p) => ({ url: `${site}${p}` })),
    ...cases.map((c) => ({ url: `${site}/work/${c.slug}` })),
    ...posts.map((p) => ({ url: `${site}/writing/${p.slug}` })),
  ];
}
