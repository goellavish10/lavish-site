import type { MetadataRoute } from "next";
import posts from "@/content/posts.json";
import { cases } from "@/content/site";

const site = "https://lavishgoyal.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", "/lab", "/play", "/writing", "/hire"];
  return [
    ...pages.map((p) => ({ url: `${site}${p}` })),
    ...cases.map((c) => ({ url: `${site}/work/${c.slug}` })),
    ...posts.map((p) => ({ url: `${site}/writing/${p.slug}` })),
  ];
}
