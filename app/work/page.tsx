import type { Metadata } from "next";
import Link from "next/link";
import { CaseArt } from "@/components/CaseArt";
import { cases, deletions, jobs } from "@/content/site";

export const metadata: Metadata = { title: "Work" };

export default function Work() {
  const total = deletions.reduce((n, d) => n + d.lines, 0);
  return (
    <main id="main" className="page">
      <h1>Work</h1>
      <p className="lede">Four problems I fixed at Letterdrop.</p>

      <ul className="cases">
        {cases.map((c) => (
          <li key={c.slug}>
            <Link href={`/work/${c.slug}`} className="case-card">
              <CaseArt slug={c.slug} />
              <span className="case-big">{c.big}</span>
              <span className="case-big-label">{c.bigLabel}</span>
              <span className="case-title">{c.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="deleted" aria-labelledby="deleted-title">
        <h2 id="deleted-title">{total.toLocaleString("en")} lines of dead code, deleted</h2>
        <p className="muted">August to November 2026, each one checked for live callers first.</p>
        <div className="stack" role="img" aria-label={deletions.map((d) => `${d.what}: ${d.lines} lines`).join(". ")}>
          {deletions.map((d) => (
            <span key={d.what} style={{ flexGrow: d.lines }} className="stack-part" />
          ))}
        </div>
        <ul className="stack-key">
          {deletions.map((d) => (
            <li key={d.what}>
              <span className="stack-swatch" />
              {d.what} <span className="muted">{d.lines.toLocaleString("en")}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="jobs-title">
        <h2 id="jobs-title">Where</h2>
        <ol className="jobs">
          {jobs.map((j) => (
            <li key={j.where}>
              <span className="jobs-years">{j.years}</span>
              <span className="jobs-where">{j.where}</span>
              <span className="jobs-role">{j.role}</span>
              <span className="jobs-what">{j.what}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
