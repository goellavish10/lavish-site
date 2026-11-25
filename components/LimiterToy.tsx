"use client";

import { useEffect, useRef, useState } from "react";

const SLOTS = 3;
const GAP_MS = 1200;
const TIMEOUT_FLOOR_MS = 1500;
const TIMEOUT_CEIL_MS = 5000;
const SHOWN_IN_LANE = 12;

type Lane = "urgent" | "background";
type Job = { id: number; lane: Lane; at: number; deadline: number };
type Line = { id: number; tone: "ok" | "late"; text: string };

type View = {
  urgent: number;
  background: number;
  slots: number[];
  served: number;
  timedOut: number;
};

const idle: View = { urgent: 0, background: 0, slots: Array(SLOTS).fill(0), served: 0, timedOut: 0 };

export function LimiterToy() {
  const [view, setView] = useState<View>(idle);
  const [lines, setLines] = useState<Line[]>([]);
  // Queue state lives in a ref so bursts of clicks and the drain loop never see a stale render.
  const sim = useRef({ queue: [] as Job[], slots: Array<number>(SLOTS).fill(0), done: [] as number[], served: 0, timedOut: 0 });
  const nextId = useRef(0);

  function throughputPerSec(now: number) {
    const s = sim.current;
    s.done = s.done.filter((t) => now - t < 10_000);
    return s.done.length >= 3 ? s.done.length / 10 : SLOTS / (GAP_MS / 1000);
  }

  function enqueue(lane: Lane) {
    const now = performance.now();
    const s = sim.current;
    const ahead = lane === "urgent" ? s.queue.filter((j) => j.lane === "urgent").length : s.queue.length;
    const estimate = ((ahead + 1) / throughputPerSec(now)) * 1.5 * 1000;
    const timeout = Math.min(TIMEOUT_CEIL_MS, Math.max(TIMEOUT_FLOOR_MS, estimate));
    s.queue.push({ id: nextId.current++, lane, at: now, deadline: now + timeout });
  }

  useEffect(() => {
    const s = sim.current;
    const log = (tone: Line["tone"], text: string) =>
      setLines((prev) => [{ id: nextId.current++, tone, text }, ...prev].slice(0, 6));

    async function run(job: Job, now: number) {
      const waited = ((now - job.at) / 1000).toFixed(1);
      const started = performance.now();
      try {
        const res = await fetch("/api/ping", { cache: "no-store" });
        await res.arrayBuffer();
        const ms = Math.round(performance.now() - started);
        log("ok", `200  ${job.lane.padEnd(10)} waited ${waited}s  ${ms}ms`);
      } catch {
        log("late", `503  ${job.lane.padEnd(10)} network error`);
      }
    }

    const tick = setInterval(() => {
      const now = performance.now();

      const expired = s.queue.filter((j) => now > j.deadline);
      if (expired.length) {
        s.queue = s.queue.filter((j) => now <= j.deadline);
        s.timedOut += expired.length;
        for (const j of expired) log("late", `408  ${j.lane.padEnd(10)} timed out, retry`);
      }

      // Scan from a random slot so no single slot (or server) always wins.
      const offset = Math.floor(Math.random() * SLOTS);
      for (let k = 0; k < SLOTS && s.queue.length; k++) {
        const i = (offset + k) % SLOTS;
        if (s.slots[i] > now) continue;
        const urgentAt = s.queue.findIndex((j) => j.lane === "urgent");
        const [job] = s.queue.splice(urgentAt >= 0 ? urgentAt : 0, 1);
        s.slots[i] = now + GAP_MS;
        s.done.push(now);
        s.served += 1;
        void run(job, now);
      }

      setView({
        urgent: s.queue.filter((j) => j.lane === "urgent").length,
        background: s.queue.filter((j) => j.lane === "background").length,
        slots: s.slots.map((until) => Math.max(0, until - now) / GAP_MS),
        served: s.served,
        timedOut: s.timedOut,
      });
    }, 100);

    return () => clearInterval(tick);
  }, []);

  return (
    <div className="limiter">
      <div className="limiter-controls">
        <button type="button" className="limiter-button" onClick={() => enqueue("background")}>
          Queue a background job
        </button>
        <button type="button" className="limiter-button urgent" onClick={() => enqueue("urgent")}>
          Someone&rsquo;s waiting
        </button>
      </div>

      <div className="limiter-machine" aria-hidden="true">
        {(["urgent", "background"] as const).map((lane) => (
          <div className="lane" key={lane}>
            <span className="lane-name">{lane}</span>
            <span className="lane-jobs">
              {Array.from({ length: Math.min(view[lane], SHOWN_IN_LANE) }, (_, i) => (
                <span key={i} className={`job job-${lane}`} />
              ))}
              {view[lane] > SHOWN_IN_LANE && <span className="lane-more">+{view[lane] - SHOWN_IN_LANE}</span>}
            </span>
          </div>
        ))}
        <div className="slots">
          {view.slots.map((busy, i) => (
            <span className="slot" key={i}>
              <span className="slot-fill" style={{ transform: `scaleX(${busy})` }} />
            </span>
          ))}
        </div>
      </div>

      <ol className="limiter-log" aria-live="polite" aria-relevant="additions">
        {lines.length === 0 ? (
          <li className="log-empty">No requests yet.</li>
        ) : (
          lines.map((l) => (
            <li key={l.id} className={l.tone === "ok" ? "log-ok" : "log-limited"}>
              {l.text}
            </li>
          ))
        )}
      </ol>
      <p className="limiter-tally">
        {view.served} served, {view.timedOut} timed out and retried later.
      </p>
    </div>
  );
}
