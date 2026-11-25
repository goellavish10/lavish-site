import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseArt } from "@/components/CaseArt";
import { LimiterToy } from "@/components/LimiterToy";
import { PlanTree } from "@/components/PlanTree";
import { cases } from "@/content/site";
import { pageMeta } from "@/lib/meta";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  return c ? pageMeta({ title: c.title, description: `${c.problem} ${c.result}`, path: `/work/${c.slug}` }) : {};
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const i = cases.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const c = cases[i];
  const next = cases[(i + 1) % cases.length];

  return (
    <main id="main" className="page case">
      <p className="crumb">
        <Link href="/work">Work</Link>
      </p>
      <h1>{c.title}</h1>

      <div className="case-hero">
        <div className="case-hero-art">
          <CaseArt slug={c.slug} />
        </div>
        <p className="case-hero-num">
          <span className="case-big">{c.big}</span>
          <span className="case-big-label">{c.bigLabel}</span>
        </p>
      </div>

      <dl className="beats">
        <div>
          <dt>Problem</dt>
          <dd>{c.problem}</dd>
        </div>
        <div>
          <dt>My call</dt>
          <dd>{c.call}</dd>
        </div>
        <div>
          <dt>Result</dt>
          <dd>{c.result}</dd>
        </div>
      </dl>
      {c.note && <p className="muted case-note">{c.note}</p>}

      {c.slug === "rate-limiter" && (
        <section className="case-extra" aria-labelledby="toy-title">
          <h2 id="toy-title">Try a small copy of it</h2>
          <LimiterToy />
        </section>
      )}
      {c.slug === "nightly-spike" && (
        <section className="case-extra" aria-labelledby="plan-title">
          <h2 id="plan-title">The query plan, before and after</h2>
          <PlanTree />
        </section>
      )}

      <p className="next">
        <Link href={`/work/${next.slug}`}>Next: {next.title}</Link>
      </p>
    </main>
  );
}
