import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { email, links } from "@/content/site";
import "./globals.css";

const sans = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono" });

const description = "Full-stack engineer at Letterdrop. I make slow, flaky backends fast and boring.";

export const metadata: Metadata = {
  metadataBase: new URL("https://lavishgoyal.vercel.app"),
  title: { default: "Lavish Goyal", template: "%s | Lavish Goyal" },
  description,
  openGraph: { title: "Lavish Goyal", description, type: "website", url: "/" },
  twitter: { card: "summary_large_image", creator: "@lavishG10" },
  alternates: { types: { "text/markdown": "/llms.txt" } },
};

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lavish Goyal",
  jobTitle: "Full-stack engineer",
  worksFor: { "@type": "Organization", name: "Letterdrop" },
  url: "https://lavishgoyal.vercel.app",
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
