import type { Metadata } from "next";
import { LabArt } from "@/components/LabArt";
import { projects } from "@/content/site";

export const metadata: Metadata = { title: "Lab" };

export default function Lab() {
  return (
    <main id="main" className="page">
      <h1>Lab</h1>
      <p className="lede">Small tools I built because I wanted them.</p>
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
