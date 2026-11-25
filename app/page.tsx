import { Photo } from "@/components/Photo";
import { SystemMap } from "@/components/SystemMap";
import { links, nowPlaying } from "@/content/site";

export default function Home() {
  return (
    <main id="main" className="home">
      <section className="intro">
        <Photo name="me" alt="Lavish Goyal" className="intro-photo" sizes="112px" fallback="/lavish.jpg" />
        <div>
          <h1>Lavish Goyal</h1>
          <p className="lede">Full-stack engineer at Letterdrop. I make slow, flaky backends fast and boring.</p>
          <p className="intro-links">
            {links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </p>
        </div>
      </section>

      <h2 className="visually-hidden">Pages</h2>
      <SystemMap />

      <p className="now">
        <span className="dot dot-ok" aria-hidden="true" /> Now: {nowPlaying ? `${nowPlaying} on the PS5, and ` : ""}training for a sub-60 10k in February.
      </p>
    </main>
  );
}
