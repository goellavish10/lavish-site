import type { Metadata } from "next";
import { email, offers } from "@/content/site";

export const metadata: Metadata = { title: "Hire me" };

const icons: Record<string, React.ReactNode> = {
  gauge: <path d="M6,26 a14,14 0 1 1 28,0 M20,26 L28,14" />,
  agent: (
    <>
      <rect x={8} y={12} width={24} height={18} rx={6} />
      <path d="M20,6 v6 M15,21 h0.01 M25,21 h0.01" />
    </>
  ),
  rocket: <path d="M20,4 C28,10 28,22 24,30 H16 C12,22 12,10 20,4Z M16,30 l-4,6 M24,30 l4,6" />,
  plug: <path d="M14,4 v8 M26,4 v8 M10,12 h20 v6 a10,10 0 0 1 -20,0Z M20,28 v8" />,
};

export default function Hire() {
  const subject = encodeURIComponent("Project");
  const body = encodeURIComponent("What's broken or what you want built:\n\nTimeline:\n\nBudget range:\n");
  return (
    <main id="main" className="page">
      <h1>Hire me</h1>
      <p className="lede">I take on a few contract projects alongside my job.</p>

      <ul className="offers">
        {offers.map((o) => (
          <li key={o.title}>
            <svg viewBox="0 0 40 40" className="offer-icon" aria-hidden="true">
              {icons[o.icon]}
            </svg>
            <span className="offer-title">{o.title}</span>
            <span className="offer-what">{o.what}</span>
          </li>
        ))}
      </ul>

      <div className="cta">
        <a className="button button-big" href={`mailto:${email}?subject=${subject}&body=${body}`}>
          Email me about a project
        </a>
        <p className="muted">Tell me what&rsquo;s broken or what you want built, your timeline, and a budget range.</p>
      </div>
    </main>
  );
}
