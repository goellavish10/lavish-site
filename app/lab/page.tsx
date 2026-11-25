import type { Metadata } from "next";
import { LabArt } from "@/components/LabArt";
import { pageMeta } from "@/lib/meta";
import { projects } from "@/content/site";

export const metadata: Metadata = pageMeta({
  title: "Side Projects and Developer Tools",
  description:
    "Small tools by Lavish Goyal: a macOS clipboard manager in Swift, an LLM token cost calculator, codebase search with pgvector, and Go auth middleware.",
  path: "/lab",
});

export default function Lab() {
  return (
    <main id="main" className="page">
      <h1>
        Lab
        <span className="h1-sub">Side projects and developer tools I built because I wanted them.</span>
      </h1>
      <ul className="tiles">
        {projects.map((p) => (
          <li key={p.name}>
            <a href={p.href} className="tile">
              <LabArt art={p.art} />
              <span className="tile-name">{p.name}</span>
              <span className="tile-what">{p.what}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
