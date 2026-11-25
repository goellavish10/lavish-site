export function LabArt({ art }: { art: string }) {
  if (art === "clipshelf") {
    const clips = ["git push origin main", "#f2b705", "https://github.com/…", "Standup at 10:30"];
    return (
      <svg viewBox="0 0 320 200" className="art" role="img" aria-label="A menu bar dropdown listing recent clipboard items">
        <rect x={0} y={0} width={320} height={26} className="art-bar" />
        <rect x={236} y={7} width={14} height={12} rx={3} className="art-icon" />
        <rect x={120} y={34} width={190} height={150} rx={12} className="art-box art-box-strong" />
        {clips.map((c, i) => (
          <g key={c}>
            <rect x={130} y={46 + i * 33} width={170} height={26} rx={6} className={i === 0 ? "art-fill-soft" : "art-none"} />
            <text x={140} y={63 + i * 33} className="art-mono">
              {c}
            </text>
          </g>
        ))}
      </svg>
    );
  }
  if (art === "cost") {
    const parts = [
      { label: "input", w: 96, tone: "art-fill-muted" },
      { label: "cached", w: 70, tone: "art-fill-ok" },
      { label: "output", w: 56, tone: "art-fill-wait" },
      { label: "thinking", w: 68, tone: "art-fill-fail" },
    ];
    let x = 15;
    return (
      <svg viewBox="0 0 320 200" className="art" role="img" aria-label="One request split into input, cached, output and thinking tokens, priced for Claude, GPT and Gemini">
        {parts.map((part) => {
          const at = x;
          x += part.w;
          return (
            <g key={part.label}>
              <rect x={at} y={60} width={part.w - 4} height={34} rx={6} className={part.tone} />
              <text x={at + (part.w - 4) / 2} y={114} textAnchor="middle" className="art-label">
                {part.label}
              </text>
            </g>
          );
        })}
        {["Claude", "GPT", "Gemini"].map((name, i) => (
          <g key={name}>
            <rect x={15 + i * 100} y={140} width={88} height={30} rx={15} className="art-box" />
            <text x={59 + i * 100} y={160} textAnchor="middle" className="art-text">
              {name}
            </text>
          </g>
        ))}
      </svg>
    );
  }
  if (art === "index") {
    return (
      <svg viewBox="0 0 320 200" className="art" role="img" aria-label="A plain-English question about a codebase answered with a file and line">
        <rect x={20} y={24} width={230} height={44} rx={14} className="art-box art-box-strong" />
        <text x={36} y={51} className="art-text">
          Where do we retry webhooks?
        </text>
        <rect x={70} y={92} width={230} height={76} rx={14} className="art-fill-soft" />
        <text x={86} y={118} className="art-mono">
          webhooks/retry.ts : 42
        </text>
        <rect x={86} y={132} width={150} height={8} rx={4} className="art-fill-muted" />
        <rect x={86} y={148} width={110} height={8} rx={4} className="art-fill-muted" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 200" className="art" role="img" aria-label="A request passes an auth check: valid tokens reach the handler, others get a 401">
      <rect x={14} y={80} width={70} height={36} rx={8} className="art-box" />
      <text x={49} y={103} textAnchor="middle" className="art-text">
        request
      </text>
      <path d="M84,98 L124,98" className="art-wire" />
      <rect x={124} y={70} width={70} height={56} rx={12} className="art-box art-box-strong" />
      <path d="M150,98 v-6 a9,9 0 0 1 18,0 v6" className="art-wire" />
      <rect x={146} y={96} width={26} height={18} rx={4} className="art-fill-ink" />
      <path d="M194,90 C230,90 230,50 262,50" className="art-wire" />
      <path d="M194,106 C230,106 230,146 262,146" className="art-wire" />
      <text x={270} y={55} className="art-ok-text">
        200
      </text>
      <text x={270} y={151} className="art-fail-text">
        401
      </text>
    </svg>
  );
}
