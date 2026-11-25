"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { nodes } from "@/content/site";

type Pt = { x: number; y: number };
type Layout = {
  w: number;
  h: number;
  vertical: boolean;
  client: Pt;
  limiter: { x: number; y: number; w: number; h: number };
  nodes: Pt[];
  nodeW: number;
  nodeH: number;
};

const wide: Layout = {
  w: 1000,
  h: 520,
  vertical: false,
  client: { x: 70, y: 260 },
  limiter: { x: 300, y: 190, w: 180, h: 140 },
  nodes: [62, 161, 260, 359, 458].map((y) => ({ x: 860, y })),
  nodeW: 240,
  nodeH: 78,
};

const tall: Layout = {
  w: 400,
  h: 780,
  vertical: true,
  client: { x: 200, y: 46 },
  limiter: { x: 105, y: 150, w: 190, h: 140 },
  nodes: [
    { x: 105, y: 450 },
    { x: 295, y: 450 },
    { x: 105, y: 565 },
    { x: 295, y: 565 },
    { x: 200, y: 690 },
  ],
  nodeW: 178,
  nodeH: 92,
};

const SLOTS = 3;
const GAP_MS = 900;
const IN_MS = 700;
const OUT_MS = 950;
const BACK_MS = 750;
const FLOOD = 20;

type Packet = {
  id: number;
  target: number;
  phase: "in" | "queued" | "out" | "back";
  t0: number;
  deadline: number;
};

type Snapshot = {
  now: number;
  packets: Packet[];
  slots: number[];
  hits: number[];
  rejectedAt: number;
  served: number;
  timedOut: number;
};

const empty: Snapshot = {
  now: 0,
  packets: [],
  slots: Array<number>(SLOTS).fill(0),
  hits: Array<number>(nodes.length).fill(-1e9),
  rejectedAt: -1e9,
  served: 0,
  timedOut: 0,
};

type Curve = [Pt, Pt, Pt, Pt];

function bezier([a, b, c, d]: Curve, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
  };
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function curves(L: Layout) {
  const { limiter: m } = L;
  if (L.vertical) {
    const top = { x: m.x + m.w / 2, y: m.y };
    const bottom = { x: m.x + m.w / 2, y: m.y + m.h };
    const from = { x: L.client.x, y: L.client.y + 22 };
    return {
      inbound: [from, { x: from.x, y: from.y + 40 }, { x: top.x, y: top.y - 40 }, top] as Curve,
      outbound: L.nodes.map((n) => {
        const end = { x: n.x, y: n.y - L.nodeH / 2 };
        return [bottom, { x: bottom.x, y: bottom.y + 80 }, { x: end.x, y: end.y - 80 }, end] as Curve;
      }),
    };
  }
  const left = { x: m.x, y: m.y + m.h / 2 };
  const right = { x: m.x + m.w, y: m.y + m.h / 2 };
  const from = { x: L.client.x + 26, y: L.client.y };
  return {
    inbound: [from, { x: from.x + 60, y: from.y }, { x: left.x - 60, y: left.y }, left] as Curve,
    outbound: L.nodes.map((n) => {
      const end = { x: n.x - L.nodeW / 2, y: n.y };
      return [right, { x: right.x + 140, y: right.y }, { x: end.x - 150, y: end.y }, end] as Curve;
    }),
  };
}

const d = ([a, b, c, e]: Curve) => `M${a.x},${a.y} C${b.x},${b.y} ${c.x},${c.y} ${e.x},${e.y}`;

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(min-width: 46rem)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function SystemMap() {
  const isWide = useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(min-width: 46rem)").matches,
    () => true,
  );
  const L = isWide ? wide : tall;
  const paths = curves(L);
  const router = useRouter();

  const sim = useRef({
    packets: [] as Packet[],
    slots: Array<number>(SLOTS).fill(0),
    hits: Array<number>(nodes.length).fill(-1e9),
    rejectedAt: -1e9,
    served: 0,
    timedOut: 0,
    nextId: 0,
  });
  const [view, setView] = useState<Snapshot>(empty);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);

  function send(target: number, at = performance.now()) {
    const s = sim.current;
    s.packets.push({ id: s.nextId++, target, phase: "in", t0: at, deadline: 0 });
  }

  function flood() {
    setTouched(true);
    const at = performance.now();
    for (let i = 0; i < FLOOD; i++) send(Math.floor(Math.random() * nodes.length), at + i * 45);
  }

  useEffect(() => {
    const s = sim.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    function step(t: number) {
      const queued = s.packets.filter((p) => p.phase === "queued");

      for (const p of s.packets) {
        if (p.phase === "in" && t - p.t0 >= IN_MS) {
          const ahead = s.packets.filter((q) => q.phase === "queued").length;
          const timeout = Math.min(3000, Math.max(1200, ((ahead + 1) / (SLOTS / GAP_MS)) * 1.5));
          p.phase = "queued";
          p.t0 = t;
          p.deadline = t + timeout;
        } else if (p.phase === "queued" && t > p.deadline) {
          p.phase = "back";
          p.t0 = t;
          s.timedOut += 1;
        }
      }

      // Start from a random slot so no slot always wins.
      const offset = Math.floor(Math.random() * SLOTS);
      for (let k = 0; k < SLOTS; k++) {
        const i = (offset + k) % SLOTS;
        const next = queued.find((p) => p.phase === "queued");
        if (!next || s.slots[i] > t) continue;
        next.phase = "out";
        next.t0 = t;
        s.slots[i] = t + GAP_MS;
        s.served += 1;
      }

      s.packets = s.packets.filter((p) => {
        if (p.phase === "out" && t - p.t0 >= OUT_MS) {
          s.hits[p.target] = t;
          return false;
        }
        if (p.phase === "back" && t - p.t0 >= BACK_MS) {
          s.rejectedAt = t;
          return false;
        }
        return true;
      });
    }

    const loop = (t: number) => {
      step(t);
      setView({
        now: t,
        packets: s.packets.map((p) => ({ ...p })),
        slots: [...s.slots],
        hits: [...s.hits],
        rejectedAt: s.rejectedAt,
        served: s.served,
        timedOut: s.timedOut,
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const auto = reduced
      ? undefined
      : setInterval(() => {
          if (!document.hidden) send(Math.floor(Math.random() * nodes.length));
        }, 1500);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(auto);
    };
  }, []);

  function enter(e: React.MouseEvent, i: number) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    setLeaving(i);
    setTimeout(() => router.push(nodes[i].href), 280);
  }

  const { now, ...s } = view;
  const queued = s.packets.filter((p) => p.phase === "queued");
  const m = L.limiter;
  const perRow = 8;
  const shownQueue = Math.min(queued.length, perRow * 2);

  return (
    <div className={`map ${leaving !== null ? "is-leaving" : ""}`}>
      <div className="map-stage" style={{ aspectRatio: `${L.w} / ${L.h}` }}>
        <svg viewBox={`0 0 ${L.w} ${L.h}`} aria-hidden="true" className="map-svg">
          <path d={d(paths.inbound)} className="wire" />
          {paths.outbound.map((c, i) => (
            <path key={i} d={d(c)} className={`wire ${leaving === i ? "wire-hot" : ""}`} />
          ))}

          <g className="client">
            <circle cx={L.client.x} cy={L.client.y} r={22} />
            <path
              d={`M${L.client.x - 6},${L.client.y - 10} l13,11 -6,1 4,8 -3,1.5 -4,-8 -4,4z`}
              className="cursor"
            />
            <text x={L.client.x} y={L.vertical ? L.client.y - 30 : L.client.y + 44} textAnchor="middle">
              you
            </text>
            {now - s.rejectedAt < 700 && (
              <text
                x={L.vertical ? L.client.x + 40 : L.client.x}
                y={L.vertical ? L.client.y + 6 : L.client.y - 34}
                textAnchor="middle"
                className="code-408"
              >
                408
              </text>
            )}
          </g>

          <g className="map-limiter">
            <rect x={m.x} y={m.y} width={m.w} height={m.h} rx={14} />
            <text x={m.x + 16} y={m.y + 28}>
              rate limiter
            </text>
            {Array.from({ length: shownQueue }, (_, i) => (
              <circle
                key={i}
                cx={m.x + 22 + (i % perRow) * 19}
                cy={m.y + 54 + Math.floor(i / perRow) * 18}
                r={6}
                className="pkt pkt-wait"
              />
            ))}
            {queued.length > shownQueue && (
              <text x={m.x + m.w - 14} y={m.y + 28} textAnchor="end" className="more">
                +{queued.length - shownQueue}
              </text>
            )}
            {s.slots.map((until, i) => {
              const busy = Math.max(0, until - now) / GAP_MS;
              const w = (m.w - 32 - 2 * 8) / SLOTS;
              const x = m.x + 16 + i * (w + 8);
              return (
                <g key={i}>
                  <rect x={x} y={m.y + m.h - 30} width={w} height={12} rx={6} className="map-slot" />
                  <rect x={x} y={m.y + m.h - 30} width={w * busy} height={12} rx={6} className="map-slot-fill" />
                </g>
              );
            })}
          </g>

          {s.packets.map((p) => {
            if (p.phase === "queued") return null;
            const dur = p.phase === "in" ? IN_MS : p.phase === "out" ? OUT_MS : BACK_MS;
            const k = Math.min(1, Math.max(0, (now - p.t0) / dur));
            if (now < p.t0) return null;
            const pos =
              p.phase === "in"
                ? bezier(paths.inbound, ease(k))
                : p.phase === "out"
                  ? bezier(paths.outbound[p.target], ease(k))
                  : bezier(paths.inbound, 1 - ease(k));
            const tone = p.phase === "out" ? "pkt-ok" : p.phase === "back" ? "pkt-fail" : "pkt-in";
            return <circle key={p.id} cx={pos.x} cy={pos.y} r={6} className={`pkt ${tone}`} />;
          })}
        </svg>

        {nodes.map((n, i) => {
          const c = L.nodes[i];
          const hit = now - s.hits[i] < 380;
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={(e) => enter(e, i)}
              className={`node ${hit ? "is-hit" : ""} ${leaving === i ? "is-entering" : ""}`}
              style={{
                left: `${(c.x / L.w) * 100}%`,
                top: `${(c.y / L.h) * 100}%`,
                width: `${(L.nodeW / L.w) * 100}%`,
                height: `${(L.nodeH / L.h) * 100}%`,
              }}
            >
              <span className="node-name">{n.name}</span>
              <span className="node-stat">{n.stat}</span>
            </Link>
          );
        })}
      </div>

      <div className="map-controls">
        <button type="button" className="button" onClick={flood}>
          Send {FLOOD} requests at once
        </button>
        <p className="map-tally">
          {touched
            ? `${s.served} served, ${s.timedOut} timed out. Three slots, one request each every ${GAP_MS / 1000} s.`
            : "Each dot is a request. Pick a page, or flood the limiter."}
        </p>
      </div>
    </div>
  );
}
