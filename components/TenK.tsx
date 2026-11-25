"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

function weeksToFebruary() {
  const now = new Date();
  const year = now.getMonth() >= 2 ? now.getFullYear() + 1 : now.getFullYear();
  const feb = new Date(year, 1, 1);
  return Math.max(0, Math.ceil((feb.getTime() - now.getTime()) / (7 * 24 * 3600 * 1000)));
}

export function TenK() {
  const weeks = useSyncExternalStore(noop, weeksToFebruary, () => null);
  return (
    <figure className="tenk">
      <div className="tenk-track" role="img" aria-label="Ten kilometres at six minutes each, finishing under sixty minutes">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="tenk-km">
            <span className="tenk-n">{i + 1}</span>
            <span className="tenk-pace">6:00</span>
          </span>
        ))}
        <span className="tenk-flag">
          <span>&lt; 60:00</span>
        </span>
      </div>
      <figcaption>
        <strong>First 10k, under an hour.</strong> Race day is in February
        {weeks !== null && weeks > 0 ? `, ${weeks} weeks from today` : ""}. Strength sessions on the side.
      </figcaption>
    </figure>
  );
}
