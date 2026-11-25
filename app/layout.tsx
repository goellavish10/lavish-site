import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { email, links } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const sans = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono" });

const description =
  "Lavish Goyal is a full-stack engineer at Letterdrop working on rate limiting, database performance, job queues and LLM agents.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Lavish Goyal | Backend and Full-Stack Engineer", template: "%s | Lavish Goyal" },
  applicationName: "Lavish Goyal",
  authors: [{ name: "Lavish Goyal" }],
  alternates: { canonical: "/", types: { "text/markdown": "/llms.txt" } },
  description,
  openGraph: { title: "Lavish Goyal | Backend and Full-Stack Engineer", description, type: "website", url: "/", siteName: "Lavish Goyal" },
  twitter: { card: "summary_large_image", creator: "@lavishG10" },
};

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lavish Goyal",
  jobTitle: "Full-stack engineer",
  worksFor: { "@type": "Organization", name: "Letterdrop" },
  knowsAbout: ["Backend engineering", "Rate limiting", "MongoDB", "Redis", "Node.js", "Go", "LLM agents"],
  url: siteUrl,
  email: `mailto:${email}`,
  sameAs: links.filter((l) => l.label !== "Résumé").map((l) => l.href),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer commit={commit} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </body>
    </html>
  );
}
