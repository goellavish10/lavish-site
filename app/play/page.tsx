import type { Metadata } from "next";
import { Photo } from "@/components/Photo";
import { pageMeta } from "@/lib/meta";
import Image from "next/image";
import { TenK } from "@/components/TenK";
import { games } from "@/content/site";

export const metadata: Metadata = pageMeta({
  title: "Games and Running",
  description: "The PS5 story games I play, and my training for a first 10k under 60 minutes.",
  path: "/play",
});

export default function Play() {
  return (
    <main id="main" className="page">
      <h1>
        Play
        <span className="h1-sub">Story games on the PS5, a sub-60 10k in February, and cricket.</span>
      </h1>

      <section aria-labelledby="shelf-title">
        <h2 id="shelf-title">The shelf</h2>
        <ul className="shelf">
          {games.map((g) => (
            <li key={g.title} className="game">
              <Image src={g.cover} alt={`${g.title} cover art`} width={640} height={640} className="cover" sizes="(min-width: 46rem) 14rem, 45vw" />
              <span className="game-title">{g.title}</span>
              <span className="game-status">{g.status}</span>
              {g.progress !== null && (
                <span className="meter" role="img" aria-label={`${Math.round(g.progress * 100)}% complete`}>
                  <span style={{ width: `${g.progress * 100}%` }} />
                </span>
              )}
              {"note" in g && <span className="game-note">{g.note}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="run-title">
        <h2 id="run-title">Training</h2>
        <TenK />
      </section>

      <div className="photos">
        <Photo name="run" alt="Out on a training run" sizes="(min-width: 46rem) 33vw, 100vw" />
        <Photo name="gym" alt="At the gym" sizes="(min-width: 46rem) 33vw, 100vw" />
        <Photo name="setup" alt="My PS5 setup" sizes="(min-width: 46rem) 33vw, 100vw" />
      </div>

      <p className="muted credit">Cover art from the PlayStation Store, owned by each game&rsquo;s publisher.</p>
    </main>
  );
}
