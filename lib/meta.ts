import type { Metadata } from "next";

// A page-level openGraph replaces the root one, so the share image has to be repeated here.
const image = { url: "/opengraph-image", width: 1200, height: 630, alt: "Lavish Goyal, full-stack engineer" };

export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", siteName: "Lavish Goyal", images: [image] },
    twitter: { card: "summary_large_image", creator: "@lavishG10", title, description, images: [image] },
  };
}
