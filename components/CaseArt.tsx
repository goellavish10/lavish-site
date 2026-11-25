export function CaseArt({ slug }: { slug: string }) {
  switch (slug) {
    case "rate-limiter":
      return <LimiterArt />;
    case "database-spend":
      return <SpendArt />;
    case "nightly-spike":
      return <SpikeArt />;
    case "crash-safe-workers":
      return <WorkerArt />;
    default:
      return null;
  }
}

function LimiterArt() {
  const servers = [30, 70, 110, 150, 190];
  return (
    <svg viewBox="0 0 320 220" className="art" role="img" aria-label="Five servers sending requests through one shared limiter with three slots">
      {servers.map((y, i) => (
        <g key={y}>
          <rect x={14} y={y - 12} width={54} height={24} rx={6} className="art-box" />
          <path d={`M68,${y} C110,${y} 110,110 150,110`} className="art-wire" />
          <circle cx={96 + (i % 2) * 10} cy={y + (110 - y) * 0.35} r={5} className={i === 2 ? "art-fail" : "art-ok"} />
        </g>
      ))}
      <rect x={150} y={70} width={100} height={80} rx={12} className="art-box art-box-strong" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={162 + i * 27} y={126} width={22} height={10} rx={5} className={i < 2 ? "art-fill-ok" : "art-slot"} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={166 + i * 17} cy={98} r={5} className="art-wait" />
      ))}
      <path d="M250,110 L306,110" className="art-wire" />
      <path d="M296,103 L306,110 L296,117" className="art-wire" />
    </svg>
  );
}

function Bar({ x, h, label, value, tone }: { x: number; h: number; label: string; value: string; tone: string }) {
  const base = 180;
  return (
    <g>
      <rect x={x} y={base - h} width={56} height={h} rx={6} className={tone} />
      <text x={x + 28} y={base - h - 8} textAnchor="middle" className="art-value">
        {value}
      </text>
      <text x={x + 28} y={base + 20} textAnchor="middle" className="art-label">
        {label}
      </text>
    </g>
  );
}

function SpendArt() {
  return (
    <svg viewBox="0 0 320 220" className="art" role="img" aria-label="Database spend down 55 percent and daily slow-query time down 66 percent">
      <Bar x={20} h={140} label="spend" value="before" tone="art-fill-muted" />
      <Bar x={84} h={63} label="" value="−55%" tone="art-fill-ok" />
      <Bar x={176} h={140} label="slow queries" value="before" tone="art-fill-muted" />
      <Bar x={240} h={48} label="" value="−66%" tone="art-fill-ok" />
      <path d="M10,180 L310,180" className="art-axis" />
    </svg>
  );
}

function SpikeArt() {
  const bars = [
    { label: "before", pct: 108, tone: "art-fill-fail" },
    { label: "lazy load", pct: 104, tone: "art-fill-wait" },
    { label: "+ index", pct: 8, tone: "art-fill-ok" },
  ];
  return (
    <svg viewBox="0 0 320 220" className="art" role="img" aria-label="Peak CPU in a local benchmark: 108 percent before, 104 percent with lazy loading, 8 percent with the index">
      {bars.map((b, i) => (
        <Bar key={b.label} x={24 + i * 100} h={b.pct * 1.3} label={b.label} value={`${b.pct}%`} tone={b.tone} />
      ))}
      <path d="M10,180 L310,180" className="art-axis" />
    </svg>
  );
}

function WorkerArt() {
  return (
    <svg viewBox="0 0 320 220" className="art" role="img" aria-label="A job is killed at 60 percent and a new instance resumes from 60 percent instead of zero">
      <text x={14} y={46} className="art-label-left">
        instance A
      </text>
      <rect x={14} y={56} width={292} height={18} rx={9} className="art-slot" />
      <rect x={14} y={56} width={175} height={18} rx={9} className="art-fill-ok" />
      <path d="M182,48 l14,14 M196,48 l-14,14" className="art-kill" />

      <text x={14} y={122} className="art-label-left">
        instance B
      </text>
      <rect x={14} y={132} width={292} height={18} rx={9} className="art-slot" />
      <rect x={14} y={132} width={175} height={18} rx={9} className="art-fill-ghost" />
      <rect x={189} y={132} width={117} height={18} rx={9} className="art-fill-ok" />
      <path d="M189,96 L189,128" className="art-wire art-dash" />
      <text x={189} y={182} textAnchor="middle" className="art-value">
        resumes here
      </text>
    </svg>
  );
}
